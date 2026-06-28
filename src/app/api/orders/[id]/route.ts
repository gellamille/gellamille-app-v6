import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";

const itemSchema = z.object({
  productId: z.number().int().positive(),
  cartons: z.number().int().positive()
});

const updateSchema = z.object({
  requestedDeliveryDate: z.string().date(),
  paymentMethod: z.enum(["cash_on_delivery", "card_on_delivery", "bank_transfer"]),
  deliveryAddressId: z.number().int().positive().optional().nullable(),
  note: z.string().max(2000).optional().default(""),
  items: z.array(itemSchema).min(1)
});

const deleteSchema = z.object({
  reason: z.string().trim().min(5).max(1000)
});

const WRITE_ROLES = ["admin", "management", "sales"];

type OrderRow = {
  id: number;
  order_number: string;
  order_year: number;
  organization_id: number;
  partner_id: number;
  status: string;
  fulfillment_status: string;
  finance_status: string;
  requested_delivery_date: string;
};

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await apiUser(WRITE_ROLES);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) return NextResponse.json({ error: "Hibás rendelésazonosító." }, { status: 400 });

  try {
    const input = updateSchema.parse(await request.json());
    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);
      const beforeResult = await client.query<OrderRow>(`
        select id,order_number,order_year,organization_id,partner_id,status,fulfillment_status,finance_status,requested_delivery_date
          from public.orders
         where id=$1 and archived_at is null
         for update
      `, [orderId]);
      const order = beforeResult.rows[0];
      if (!order || order.organization_id !== user.organization_id) throw new Error("A rendelés nem található.");
      assertEditableOrder(order);
      await assertNoDeliveredItems(client, order.id);
      if (Number(order.order_year) !== Number(input.requestedDeliveryDate.slice(0, 4))) {
        throw new Error("A rendelés éve nem módosítható. Másik évre új rendelést kell rögzíteni.");
      }

      await validatePartnerDeliveryDate(client, order.partner_id, input.requestedDeliveryDate);
      await validateDeliveryAddress(client, order.partner_id, input.deliveryAddressId ?? null);

      const beforeItems = await client.query(`select * from public.order_items where order_id=$1 order by id for update`, [order.id]);
      await releaseOrderStock(client, order, user.user_id, "Rendelés módosítása miatt visszarendezve");

      const items = mergeItems(input.items);
      const totalRequestedCartons = items.reduce((sum, item) => sum + item.cartons, 0);
      await validateMinimumOrder(client, order.partner_id, totalRequestedCartons);
      const existingByProduct = new Map(beforeItems.rows.map((item: any) => [Number(item.product_id), item]));
      const nextProductIds = new Set(items.map((item) => item.productId));
      const updatedItems = [];
      for (const item of items) {
        const product = await loadOrderProduct(client, item.productId, order.organization_id, order.partner_id);
        const units = item.cartons * Number(product.units_per_carton);
        const net = units * Number(product.effective_price);
        const vat = Math.round(net * Number(product.vat_rate_bps) / 10000);
        const gross = net + vat;
        const existing = existingByProduct.get(item.productId);
        const saved = existing
          ? await client.query(`
              update public.order_items set
                cartons=$2,product_code_snapshot=$3,product_name_snapshot=$4,flavor_code_snapshot=$5,
                size_ml_snapshot=$6,units_per_carton_snapshot=$7,net_unit_price_huf_snapshot=$8,vat_rate_bps_snapshot=$9,
                unit_quantity=$10,net_total_huf=$11,vat_total_huf=$12,gross_total_huf=$13,
                purchase_unit_price_huf_snapshot=$14,reserved_quantity=0,fulfilled_quantity=0,cancelled_quantity=0,
                version=version+1
              where id=$1
              returning *
            `, [
              existing.id,
              item.cartons,
              product.code,
              product.name,
              product.flavor_code,
              product.size_ml,
              product.units_per_carton,
              product.effective_price,
              product.vat_rate_bps,
              units,
              net,
              vat,
              gross,
              product.purchase_unit_price_huf ?? 0
            ])
          : await client.query(`
          insert into public.order_items(
            order_id,product_id,cartons,product_code_snapshot,product_name_snapshot,flavor_code_snapshot,
            size_ml_snapshot,units_per_carton_snapshot,net_unit_price_huf_snapshot,vat_rate_bps_snapshot,
            unit_quantity,net_total_huf,vat_total_huf,gross_total_huf,purchase_unit_price_huf_snapshot
          ) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
          returning *
        `, [
          order.id,
          product.id,
          item.cartons,
          product.code,
          product.name,
          product.flavor_code,
          product.size_ml,
          product.units_per_carton,
          product.effective_price,
          product.vat_rate_bps,
          units,
          net,
          vat,
          gross,
          product.purchase_unit_price_huf ?? 0
        ]);
        updatedItems.push(saved.rows[0]);
      }
      for (const oldItem of beforeItems.rows) {
        if (nextProductIds.has(Number(oldItem.product_id))) continue;
        const cleared = await client.query(`
          update public.order_items set
            cartons=0,unit_quantity=0,net_total_huf=0,vat_total_huf=0,gross_total_huf=0,
            reserved_quantity=0,fulfilled_quantity=0,cancelled_quantity=0,version=version+1
          where id=$1
          returning *
        `, [oldItem.id]);
        updatedItems.push(cleared.rows[0]);
      }

      const totals = await client.query<any>(`
        select sum(cartons)::int total_cartons,sum(unit_quantity)::int total_units,
               sum(net_total_huf)::int net_total_huf,sum(vat_total_huf)::int vat_total_huf,
               sum(gross_total_huf)::int gross_total_huf
          from public.order_items
         where order_id=$1
      `, [order.id]);
      const total = totals.rows[0];
      const updated = await client.query<any>(`
        update public.orders
           set requested_delivery_date=$2,
               payment_method=$3,
               delivery_address_id=$4,
               note=$5,
               total_cartons=$6,
               total_units=$7,
               net_total_huf=$8,
               vat_total_huf=$9,
               gross_total_huf=$10,
               status='submitted',
               fulfillment_status='unreserved',
               accepted_with_shortage=false,
               approved_by=null,
               approved_at=null,
               version=version+1
         where id=$1
         returning *
      `, [
        order.id,
        input.requestedDeliveryDate,
        input.paymentMethod,
        input.deliveryAddressId ?? null,
        input.note || null,
        total.total_cartons,
        total.total_units,
        total.net_total_huf,
        total.vat_total_huf,
        total.gross_total_huf
      ]);

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,before_data,after_data)
        values($1,'order.updated','order',$2,$3::jsonb,$4::jsonb)
      `, [user.user_id, String(order.id), JSON.stringify({ order, items: beforeItems.rows }), JSON.stringify({ order: updated.rows[0], items: updatedItems })]);
      await queueOrderEmail(client, order.organization_id, order.partner_id, "order_updated", `Gellamille rendelés módosítva – ${order.order_number}`, `${order.order_number} rendelés módosítva lett. Az új bruttó összeg: ${total.gross_total_huf} Ft.`, order.id, order.order_number);
      return updated.rows[0];
    });

    return NextResponse.json(result);
  } catch (error) {
    return apiError(error, "A rendelés módosítása sikertelen.");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await apiUser(WRITE_ROLES);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) return NextResponse.json({ error: "Hibás rendelésazonosító." }, { status: 400 });

  try {
    const input = deleteSchema.parse(await request.json());
    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);
      const beforeResult = await client.query<OrderRow>(`
        select id,order_number,order_year,organization_id,partner_id,status,fulfillment_status,finance_status,requested_delivery_date
          from public.orders
         where id=$1 and archived_at is null
         for update
      `, [orderId]);
      const order = beforeResult.rows[0];
      if (!order || order.organization_id !== user.organization_id) throw new Error("A rendelés nem található.");
      assertEditableOrder(order);
      await assertNoDeliveredItems(client, order.id);
      const beforeItems = await client.query(`select * from public.order_items where order_id=$1 order by id`, [order.id]);
      await releaseOrderStock(client, order, user.user_id, "Rendelés törlése miatt visszarendezve");

      await client.query(`update public.order_items set cancelled_quantity=unit_quantity-fulfilled_quantity,reserved_quantity=0 where order_id=$1`, [order.id]);
      const updated = await client.query<any>(`
        update public.orders
           set status='cancelled',
               fulfillment_status='cancelled',
               voided_by=$2,
               voided_at=now(),
               void_reason=$3,
               archived_at=now(),
               version=version+1
         where id=$1
         returning *
      `, [order.id, user.user_id, input.reason]);

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,before_data,after_data)
        values($1,'order.deleted','order',$2,$3::jsonb,$4::jsonb)
      `, [user.user_id, String(order.id), JSON.stringify({ order, items: beforeItems.rows }), JSON.stringify({ order: updated.rows[0], reason: input.reason })]);
      await queueOrderEmail(client, order.organization_id, order.partner_id, "order_deleted", `Gellamille rendelés törölve – ${order.order_number}`, `${order.order_number} rendelés törölve lett.\n\nIndoklás: ${input.reason}`, order.id, order.order_number);
      return updated.rows[0];
    });

    return NextResponse.json(result);
  } catch (error) {
    return apiError(error, "A rendelés törlése sikertelen.");
  }
}

function assertEditableOrder(order: OrderRow) {
  if (["closed", "cancelled", "void"].includes(order.status) || ["delivered", "cancelled"].includes(order.fulfillment_status) || ["receivable", "paid", "partially_paid", "overdue", "void"].includes(order.finance_status)) {
    throw new Error("Lezárt, átadott vagy pénzügyileg érintett rendelés nem módosítható ezen a felületen.");
  }
}

async function assertNoDeliveredItems(client: any, orderId: number) {
  const delivered = await client.query(`select coalesce(sum(fulfilled_quantity),0)::int value from public.order_items where order_id=$1`, [orderId]);
  if (Number(delivered.rows[0]?.value ?? 0) > 0) {
    throw new Error("Már átadott rendelés nem módosítható vagy törölhető ezen a felületen.");
  }
}

function mergeItems(items: Array<{ productId: number; cartons: number }>) {
  const merged = new Map<number, number>();
  for (const item of items) merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.cartons);
  return [...merged.entries()].map(([productId, cartons]) => ({ productId, cartons }));
}

async function validatePartnerDeliveryDate(client: any, partnerId: number, requestedDeliveryDate: string) {
  const result = await client.query(`
    select count(*)::int as configured_count,
           coalesce(bool_or(weekday=extract(isodow from $2::date)::int), false) as selected_allowed,
           min(cutoff_business_days) filter (where weekday=extract(isodow from $2::date)::int)::int as cutoff_days
      from public.partner_delivery_days
     where partner_id=$1 and active=true
  `, [partnerId, requestedDeliveryDate]);
  const policy = result.rows[0];
  if (Number(policy?.configured_count ?? 0) < 1) throw new Error("Ehhez a partnerhez nincs aktív szállítási nap beállítva.");
  if (!policy?.selected_allowed) throw new Error("A kiválasztott dátum nem engedélyezett szállítási nap ennél a partnernél.");
  const todayIso = new Date().toISOString().slice(0, 10);
  if (requestedDeliveryDate < todayIso) throw new Error("Múltbeli szállítási napra nem módosítható a rendelés.");
  const cutoffDays = Number(policy?.cutoff_days ?? 0);
  if (cutoffDays > 0) {
    const latestOrderDate = new Date(`${requestedDeliveryDate}T00:00:00.000Z`);
    latestOrderDate.setUTCDate(latestOrderDate.getUTCDate() - cutoffDays);
    if (todayIso > latestOrderDate.toISOString().slice(0, 10)) {
      throw new Error(`Erre a szállítási napra a rendelési zárás már lejárt (${cutoffDays} naptári nap).`);
    }
  }
}

async function validateDeliveryAddress(client: any, partnerId: number, deliveryAddressId: number | null) {
  if (!deliveryAddressId) return;
  const address = await client.query(`select 1 from public.partner_addresses where id=$1 and partner_id=$2 and active=true`, [deliveryAddressId, partnerId]);
  if (!address.rowCount) throw new Error("A kiválasztott szállítási cím nem érvényes.");
}

async function validateMinimumOrder(client: any, partnerId: number, totalCartons: number) {
  const partner = await client.query(`select minimum_order_cartons from public.partners where id=$1`, [partnerId]);
  const minimum = Number(partner.rows[0]?.minimum_order_cartons ?? 0);
  if (totalCartons < minimum) throw new Error(`A minimum rendelés ${minimum} karton.`);
}

async function loadOrderProduct(client: any, productId: number, organizationId: number, partnerId: number) {
  const result = await client.query(`
    select p.*,
           coalesce(
             (select pli.net_unit_price_huf
                from public.price_list_items pli
                join public.price_lists pl on pl.id=pli.price_list_id
                join public.partners partner on partner.id=$3
               where pli.product_id=p.id and pl.active=true
                 and current_date>=pl.valid_from
                 and (pl.valid_to is null or current_date<=pl.valid_to)
                 and (pl.id=partner.price_list_id or (pl.type='general' and pl.organization_id=$2))
               order by case when pl.id=partner.price_list_id then 0 else 1 end,pl.valid_from desc limit 1),
             p.net_unit_price_huf
           )::int as effective_price
      from public.products p
     where p.id=$1 and p.organization_id=$2 and p.active=true
       and p.status in ('active','seasonal')
  `, [productId, organizationId, partnerId]);
  const product = result.rows[0];
  if (!product) throw new Error(`Nem rendelhető termékazonosító: ${productId}`);
  return product;
}

async function releaseOrderStock(client: any, order: OrderRow, userId: string, note: string) {
  const allocations = await client.query(`
    select a.*,c.carton_code
      from public.order_item_lot_allocations a
      join public.order_items oi on oi.id=a.order_item_id
      left join public.inventory_cartons c on c.id=a.carton_id
     where oi.order_id=$1 and a.status in('allocated','picked')
     for update of a
  `, [order.id]);

  await client.query(`update public.stock_reservations set status='cancelled',released_at=now() where order_item_id in(select id from public.order_items where order_id=$1) and status='active'`, [order.id]);
  await client.query(`
    update public.inventory_cartons c
       set status='in_stock'
      from public.order_item_lot_allocations a
      join public.order_items oi on oi.id=a.order_item_id
     where a.carton_id=c.id and oi.order_id=$1 and a.status in('allocated','picked')
  `, [order.id]);
  for (const allocation of allocations.rows) {
    if (!allocation.carton_id) continue;
    await client.query(`
      insert into public.inventory_carton_events(
        organization_id,carton_id,event_type,from_location_id,order_id,order_item_id,actor_user_id,note,event_data
      ) values($1,$2,'unpicked',$3,$4,$5,$6,$7,$8::jsonb)
    `, [
      order.organization_id,
      allocation.carton_id,
      allocation.location_id,
      order.id,
      allocation.order_item_id,
      userId,
      note,
      JSON.stringify({ allocation_id: allocation.id, quantity_units: Number(allocation.quantity_units), carton_code: allocation.carton_code })
    ]);
  }
  await client.query(`update public.order_item_lot_allocations set status='cancelled' where order_item_id in(select id from public.order_items where order_id=$1) and status in('allocated','picked')`, [order.id]);
}

async function queueOrderEmail(client: any, organizationId: number, partnerId: number, eventType: string, subject: string, body: string, orderId: number, orderNumber: string) {
  const recipients = await client.query(`
    select email from public.notification_recipients
     where organization_id=$1 and event_type in ($2,'order_changed') and active=true
  `, [organizationId, eventType]);
  const partner = await client.query(`select email,name from public.partners where id=$1`, [partnerId]);
  const emails = new Set<string>();
  for (const row of recipients.rows) emails.add(row.email);
  if (partner.rows[0]?.email) emails.add(partner.rows[0].email);
  for (const email of emails) {
    await client.query(`
      insert into public.email_outbox(organization_id,event_type,recipient_email,subject,body_text,payload)
      values($1,$2,$3,$4,$5,$6::jsonb)
    `, [organizationId, eventType, email, subject, body, JSON.stringify({ order_id: orderId, order_number: orderNumber, partner_id: partnerId })]);
  }
}
