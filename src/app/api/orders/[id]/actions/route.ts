import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";

const schema = z.object({
  action: z.enum(["approve", "allocate_fefo", "deliver_all", "cancel", "reject"]),
  allowPartial: z.boolean().optional().default(true),
  reason: z.string().max(1000).optional()
});

const ACTION_ROLES = ["admin", "management", "sales", "warehouse"];

type OrderRow = {
  id: number;
  organization_id: number;
  partner_id: number;
  status: string;
  fulfillment_status: string;
  requested_delivery_date: string;
  delivery_address_id: number | null;
};

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await apiUser(ACTION_ROLES);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) return NextResponse.json({ error: "Hibás rendelésazonosító." }, { status: 400 });

  try {
    const input = schema.parse(await request.json());
    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);
      const orderResult = await client.query<OrderRow>(`
        select id,organization_id,partner_id,status,fulfillment_status,requested_delivery_date,delivery_address_id
          from public.orders where id=$1 and archived_at is null for update
      `, [orderId]);
      const order = orderResult.rows[0];
      if (!order || order.organization_id !== user.organization_id) throw new Error("A rendelés nem található.");

      let payload: unknown;
      if (input.action === "approve") payload = await approveOrder(client, order, user.user_id, input.allowPartial);
      else if (input.action === "allocate_fefo") payload = await allocateFefo(client, order, user.user_id);
      else if (input.action === "deliver_all") payload = await deliverAll(client, order, user.user_id);
      else payload = await cancelOrReject(client, order, user.user_id, input.action, input.reason);

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,$2,'order',$3,$4::jsonb)
      `, [user.user_id, `order.${input.action}`, String(order.id), JSON.stringify(payload)]);
      return payload;
    });
    return NextResponse.json(result);
  } catch (error) {
    return apiError(error, "A rendelési művelet sikertelen.");
  }
}

async function centralLocation(client: any, organizationId: number) {
  const result = await client.query(`select id from public.inventory_locations where organization_id=$1 and code='CENTRAL' and active=true`, [organizationId]);
  if (!result.rows[0]) throw new Error("A Központi raktár nincs beállítva.");
  return Number(result.rows[0].id);
}

async function approveOrder(client: any, order: OrderRow, userId: string, allowPartial: boolean) {
  if (!["submitted", "stock_shortage", "partially_approved"].includes(order.status)) {
    throw new Error("Csak beérkezett vagy készlethiányos rendelés fogadható el.");
  }
  const partnerResult = await client.query(`select overdue_policy from public.partners where id=$1`, [order.partner_id]);
  const overduePolicy = partnerResult.rows[0]?.overdue_policy ?? "warn";
  const overdue = await client.query(`select coalesce(sum(outstanding_huf),0)::bigint amount from public.v_receivables_open where partner_id=$1 and due_date<current_date`, [order.partner_id]);
  const overdueAmount = Number(overdue.rows[0]?.amount ?? 0);
  if (overdueAmount > 0 && overduePolicy === "block") throw new Error("A partner lejárt tartozása miatt a rendelés elfogadása blokkolva van.");

  const locationId = await centralLocation(client, order.organization_id);
  const itemsResult = await client.query(`select id,product_id,unit_quantity,cancelled_quantity,fulfilled_quantity from public.order_items where order_id=$1 order by id for update`, [order.id]);
  let requested = 0;
  let reserved = 0;

  for (const item of itemsResult.rows) {
    const needed = Math.max(0, Number(item.unit_quantity) - Number(item.cancelled_quantity) - Number(item.fulfilled_quantity));
    requested += needed;
    const stockResult = await client.query(`
      select
        coalesce((select sum(im.quantity_units)
                    from public.inventory_movements im
                    left join public.lots l on l.id=im.lot_id
                   where im.product_id=$1 and im.location_id=$2 and im.archived_at is null
                     and (im.lot_id is null or (l.status='active' and l.best_before>=current_date))),0)::int
        -coalesce((select sum(quantity_units) from public.stock_reservations
                   where product_id=$1 and location_id=$2 and status='active' and order_item_id<>$3),0)::int
        as available_for_order
    `, [item.product_id, locationId, item.id]);
    const available = Math.max(0, Number(stockResult.rows[0]?.available_for_order ?? 0));
    const quantity = Math.min(needed, available);
    if (!allowPartial && quantity < needed) throw new Error("Nincs elegendő szabad készlet a teljes rendelés elfogadásához.");

    await client.query(`delete from public.stock_reservations where order_item_id=$1 and location_id=$2 and status='active'`, [item.id, locationId]);
    if (quantity > 0) {
      await client.query(`
        insert into public.stock_reservations(order_item_id,product_id,location_id,quantity_units,status,created_by)
        values($1,$2,$3,$4,'active',$5)
      `, [item.id, item.product_id, locationId, quantity, userId]);
    }
    await client.query(`update public.order_items set reserved_quantity=$2 where id=$1`, [item.id, quantity]);
    reserved += quantity;
  }

  const all = requested > 0 && reserved === requested;
  const any = reserved > 0;
  const status = all ? "approved" : any ? "partially_approved" : "stock_shortage";
  const fulfillment = all ? "reserved" : any ? "partially_reserved" : "unreserved";
  const updated = await client.query(`
    update public.orders set status=$2,fulfillment_status=$3,accepted_with_shortage=$4,
      approved_by=$5,approved_at=now()
    where id=$1 returning *
  `, [order.id, status, fulfillment, !all, userId]);

  if (overdueAmount > 0 && overduePolicy === "warn") {
    await client.query(`
      insert into public.tasks(organization_id,title,description,partner_id,order_id,priority,source,created_by)
      values($1,'Lejárt követelés ellenőrzése',$2,$3,$4,'high','overdue',$5)
    `, [order.organization_id, `A rendelés elfogadásakor ${overdueAmount.toLocaleString("hu-HU")} Ft lejárt követelés volt.`, order.partner_id, order.id, userId]);
  }
  return updated.rows[0];
}

async function allocateFefo(client: any, order: OrderRow, userId: string) {
  if (!["approved", "partially_approved"].includes(order.status)) throw new Error("Csak elfogadott rendelés készíthető össze.");
  const locationId = await centralLocation(client, order.organization_id);
  const items = await client.query(`select id,product_id,reserved_quantity from public.order_items where order_id=$1 order by id for update`, [order.id]);
  let totalReserved = 0;
  let totalAllocated = 0;

  for (const item of items.rows) {
    const existing = await client.query(`select coalesce(sum(quantity_units),0)::int value from public.order_item_lot_allocations where order_item_id=$1 and status in ('allocated','picked')`, [item.id]);
    let remaining = Math.max(0, Number(item.reserved_quantity) - Number(existing.rows[0]?.value ?? 0));
    totalReserved += Number(item.reserved_quantity);

    if (remaining > 0) {
      const lots = await client.query(`
        select l.id,l.lot_number,l.best_before,
          (coalesce((select sum(im.quantity_units) from public.inventory_movements im
                     where im.lot_id=l.id and im.location_id=$2 and im.archived_at is null),0)
           -coalesce((select sum(a.quantity_units) from public.order_item_lot_allocations a
                     where a.lot_id=l.id and a.location_id=$2 and a.status in ('allocated','picked')),0))::int available_units
          from public.lots l
          join public.products p on p.flavor_code=l.flavor_code and p.size_ml=l.size_ml
         where p.id=$1 and l.status='active' and l.best_before>=current_date
         order by l.best_before,l.production_date,l.id
      `, [item.product_id, locationId]);

      for (const lot of lots.rows) {
        if (remaining <= 0) break;
        const take = Math.min(remaining, Math.max(0, Number(lot.available_units)));
        if (take <= 0) continue;
        await client.query(`
          insert into public.order_item_lot_allocations(order_item_id,lot_id,location_id,quantity_units,status,created_by)
          values($1,$2,$3,$4,'allocated',$5)
        `, [item.id, lot.id, locationId, take, userId]);
        remaining -= take;
      }
    }
    const allocated = await client.query(`select coalesce(sum(quantity_units),0)::int value from public.order_item_lot_allocations where order_item_id=$1 and status in ('allocated','picked')`, [item.id]);
    totalAllocated += Number(allocated.rows[0]?.value ?? 0);
  }

  await client.query(`update public.order_item_lot_allocations set status='picked' where order_item_id in (select id from public.order_items where order_id=$1) and status='allocated'`, [order.id]);
  const packed = totalReserved > 0 && totalAllocated >= totalReserved;
  const updated = await client.query(`update public.orders set fulfillment_status=$2 where id=$1 returning *`, [order.id, packed ? "packed" : "picking"]);
  return { ...updated.rows[0], allocation_complete: packed, allocated_units: totalAllocated, reserved_units: totalReserved };
}

async function deliverAll(client: any, order: OrderRow, userId: string) {
  if (!["packed", "partially_delivered"].includes(order.fulfillment_status)) throw new Error("Csak összekészített rendelés adható át.");
  const locationId = await centralLocation(client, order.organization_id);
  const existingDelivery = await client.query(`
    select * from public.deliveries
     where order_id=$1 and organization_id=$2 and status not in ('delivered','cancelled')
       and archived_at is null
     order by shipping_run_id nulls last, created_at desc
     limit 1
     for update
  `, [order.id, order.organization_id]);
  const deliveryResult = existingDelivery.rows[0]
    ? await client.query(`
        update public.deliveries
           set partner_id=$2,address_id=$3,planned_date=coalesce(planned_date,$4),status=case when status='planned' then 'planned' else status end
         where id=$1 returning *
      `, [existingDelivery.rows[0].id, order.partner_id, order.delivery_address_id, order.requested_delivery_date])
    : await client.query(`
        insert into public.deliveries(organization_id,order_id,partner_id,address_id,planned_date,status,created_by)
        values($1,$2,$3,$4,$5,'planned',$6) returning *
      `, [order.organization_id, order.id, order.partner_id, order.delivery_address_id, order.requested_delivery_date, userId]);
  const delivery = deliveryResult.rows[0];
  const items = await client.query(`select * from public.order_items where order_id=$1 order by id for update`, [order.id]);
  let deliveredTotal = 0;

  for (const item of items.rows) {
    const allocations = await client.query(`
      select a.*,l.purchase_unit_price_huf,l.lot_number
        from public.order_item_lot_allocations a join public.lots l on l.id=a.lot_id
       where a.order_item_id=$1 and a.status='picked' order by l.best_before,l.id for update
    `, [item.id]);
    const deliveredUnits = allocations.rows.reduce((sum: number, row: any) => sum + Number(row.quantity_units), 0);
    if (deliveredUnits <= 0) continue;
    if (deliveredUnits % Number(item.units_per_carton_snapshot) !== 0) {
      throw new Error(`${item.product_name_snapshot}: partnernek csak egész karton adható át.`);
    }
    const net = deliveredUnits * Number(item.net_unit_price_huf_snapshot);
    const vat = Math.round(net * Number(item.vat_rate_bps_snapshot) / 10000);
    const gross = net + vat;
    const cogs = allocations.rows.reduce((sum: number, row: any) => sum + Number(row.quantity_units) * Number(row.purchase_unit_price_huf ?? 0), 0);

    await client.query(`
      insert into public.delivery_items(delivery_id,order_item_id,product_id,delivered_units,net_amount_huf,vat_amount_huf,gross_amount_huf,cogs_huf)
      values($1,$2,$3,$4,$5,$6,$7,$8)
    `, [delivery.id, item.id, item.product_id, deliveredUnits, net, vat, gross, cogs]);

    for (const allocation of allocations.rows) {
      await client.query(`
        insert into public.inventory_movements(organization_id,product_id,lot_id,location_id,movement_type,quantity_units,unit_cost_huf,reason,order_id,delivery_id,created_by)
        values($1,$2,$3,$4,'delivery_issue',$5,$6,'Partneri átadás',$7,$8,$9)
      `, [order.organization_id, item.product_id, allocation.lot_id, locationId, -Number(allocation.quantity_units), Number(allocation.purchase_unit_price_huf ?? 0), order.id, delivery.id, userId]);
      await client.query(`update public.order_item_lot_allocations set status='delivered',delivered_at=now() where id=$1`, [allocation.id]);
      await client.query(`
        update public.lots set status='depleted'
         where id=$1 and status='active'
           and not exists(select 1 from public.v_lot_stock_summary v where v.lot_id=$1 and v.physical_units>0)
      `, [allocation.lot_id]);
    }

    await client.query(`
      update public.order_items set fulfilled_quantity=fulfilled_quantity+$2,
        reserved_quantity=greatest(reserved_quantity-$2,0)
      where id=$1
    `, [item.id, deliveredUnits]);
    await client.query(`update public.stock_reservations set status='fulfilled',released_at=now() where order_item_id=$1 and status='active'`, [item.id]);
    deliveredTotal += deliveredUnits;
  }

  if (deliveredTotal <= 0) throw new Error("Nincs átadható, LOT-hoz rendelt tétel.");
  const completed = await client.query(`update public.deliveries set status='delivered',delivered_at=now() where id=$1 returning *`, [delivery.id]);
  return completed.rows[0];
}

async function cancelOrReject(client: any, order: OrderRow, userId: string, action: "cancel" | "reject", reason?: string) {
  const cleanReason = reason?.trim();
  if (!cleanReason || cleanReason.length < 5) throw new Error("Legalább 5 karakteres indoklás szükséges.");
  if (["closed", "cancelled", "void"].includes(order.status)) throw new Error("A rendelés már lezárt állapotban van.");
  const delivered = await client.query(`select coalesce(sum(fulfilled_quantity),0)::int value from public.order_items where order_id=$1`, [order.id]);
  if (Number(delivered.rows[0]?.value ?? 0) > 0) throw new Error("Részben átadott rendelésnél csak a hátralévő mennyiség mondható le tételesen.");

  await client.query(`update public.stock_reservations set status='cancelled',released_at=now() where order_item_id in(select id from public.order_items where order_id=$1) and status='active'`, [order.id]);
  await client.query(`update public.order_item_lot_allocations set status='cancelled' where order_item_id in(select id from public.order_items where order_id=$1) and status in('allocated','picked')`, [order.id]);
  await client.query(`update public.order_items set cancelled_quantity=unit_quantity-fulfilled_quantity,reserved_quantity=0 where order_id=$1`, [order.id]);
  const status = action === "reject" ? "rejected" : "cancelled";
  const updated = await client.query(`
    update public.orders set status=$2,fulfillment_status='cancelled',
      rejected_by=case when $2='rejected' then $3::uuid else rejected_by end,
      rejected_at=case when $2='rejected' then now() else rejected_at end,
      rejection_reason=case when $2='rejected' then $4 else rejection_reason end,
      voided_by=case when $2='cancelled' then $3::uuid else voided_by end,
      voided_at=case when $2='cancelled' then now() else voided_at end,
      void_reason=case when $2='cancelled' then $4 else void_reason end
    where id=$1 returning *
  `, [order.id, status, userId, cleanReason]);
  return updated.rows[0];
}
