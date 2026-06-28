import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";

const schema = z.object({
  code: z.string().trim().min(3).max(80)
});

const PICK_ROLES = ["admin", "management", "warehouse", "sales"];
const pickableCartonStatuses = new Set(["created", "in_stock"]);

type OrderRow = {
  id: number;
  organization_id: number;
  status: string;
  fulfillment_status: string;
};

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await apiUser(PICK_ROLES);
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
        select id,organization_id,status,fulfillment_status
          from public.orders
         where id=$1 and archived_at is null
         for update
      `, [orderId]);
      const order = orderResult.rows[0];
      if (!order || order.organization_id !== user.organization_id) throw new Error("A rendelés nem található.");
      if (!["approved", "partially_approved"].includes(order.status)) {
        throw new Error("Csak elfogadott rendeléshez lehet kartont összekészíteni.");
      }
      if (["delivered", "cancelled"].includes(order.fulfillment_status)) {
        throw new Error("Ez a rendelés már nem készíthető össze.");
      }

      const cartonResult = await client.query<any>(`
        select c.*,p.name as product_name,p.code as product_code,p.size_ml,
               l.lot_number,l.best_before,l.status as lot_status,
               loc.name as location_name,loc.type as location_type
          from public.inventory_cartons c
          join public.products p on p.id=c.product_id
          join public.lots l on l.id=c.lot_id
          left join public.inventory_locations loc on loc.id=c.location_id
         where c.organization_id=$1 and upper(c.carton_code)=upper($2) and c.archived_at is null
         limit 1
         for update of c
      `, [user.organization_id, input.code]);
      const carton = cartonResult.rows[0];
      if (!carton) throw new Error("Nem található ilyen kartonkód.");
      if (!pickableCartonStatuses.has(carton.status)) {
        throw new Error("Ez a karton már nem szabadon összekészíthető.");
      }
      if (carton.lot_status !== "active" || new Date(carton.best_before) < new Date(new Date().toISOString().slice(0, 10))) {
        throw new Error("Lejárt vagy nem aktív LOT-ból nem lehet rendelést összekészíteni.");
      }
      if (!["warehouse", "production"].includes(carton.location_type)) {
        throw new Error("Csak raktári vagy gyártási készlethelyről lehet rendeléshez összekészíteni.");
      }

      const activeAllocation = await client.query<any>(`
        select a.id,o.order_number
          from public.order_item_lot_allocations a
          join public.order_items oi on oi.id=a.order_item_id
          join public.orders o on o.id=oi.order_id
         where a.carton_id=$1 and a.status in ('allocated','picked')
         limit 1
      `, [carton.id]);
      if (activeAllocation.rows[0]) {
        throw new Error(`Ez a karton már aktív rendeléshez van rendelve: ${activeAllocation.rows[0].order_number}.`);
      }

      const itemResult = await client.query<any>(`
        select oi.id,oi.product_id,oi.product_name_snapshot,oi.unit_quantity,oi.cancelled_quantity,
               oi.fulfilled_quantity,oi.reserved_quantity,oi.units_per_carton_snapshot
          from public.order_items oi
         where oi.order_id=$1 and oi.product_id=$2
         order by oi.id
         limit 1
         for update
      `, [order.id, carton.product_id]);
      const item = itemResult.rows[0];
      if (!item) throw new Error("Ez a termék nem szerepel a rendelésben.");
      const pickedResult = await client.query<{ picked_units: number }>(`
        select coalesce(sum(a.quantity_units) filter (where a.status in ('allocated','picked')),0)::int as picked_units
          from public.order_item_lot_allocations a
         where a.order_item_id=$1
      `, [item.id]);

      const required = Math.max(0, Number(item.unit_quantity) - Number(item.cancelled_quantity) - Number(item.fulfilled_quantity));
      const picked = Number(pickedResult.rows[0]?.picked_units ?? 0);
      const missing = Math.max(0, required - picked);
      const reservedGap = Math.max(0, Number(item.reserved_quantity) - picked);
      const cartonUnits = Number(carton.quantity_units);
      if (missing <= 0) throw new Error("Ebből a termékből már minden mennyiség össze van készítve.");
      if (cartonUnits > missing) {
        throw new Error(`A karton ${cartonUnits} db, de a rendelésből már csak ${missing} db hiányzik.`);
      }
      if (cartonUnits > reservedGap) {
        throw new Error("Ehhez a kartonhoz nincs elég foglalt mennyiség. Előbb foglald újra a rendelést vagy készletezd be a hiányt.");
      }

      const allocation = await client.query<any>(`
        insert into public.order_item_lot_allocations(
          order_item_id,lot_id,location_id,quantity_units,status,carton_id,created_by
        ) values($1,$2,$3,$4,'picked',$5,$6)
        returning id,quantity_units,status
      `, [item.id, carton.lot_id, carton.location_id, cartonUnits, carton.id, user.user_id]);

      await client.query(`
        update public.inventory_cartons
           set status='picked'
         where id=$1
      `, [carton.id]);

      await client.query(`
        insert into public.inventory_carton_events(
          organization_id,carton_id,event_type,to_location_id,order_id,order_item_id,actor_user_id,note,event_data
        ) values($1,$2,'picked',$3,$4,$5,$6,$7,$8::jsonb)
      `, [
        user.organization_id,
        carton.id,
        carton.location_id,
        order.id,
        item.id,
        user.user_id,
        "Rendeléshez összekészítve scannerrel",
        JSON.stringify({ quantity_units: cartonUnits, allocation_id: allocation.rows[0].id })
      ]);

      const readiness = await client.query<any>(`
        with item_status as (
          select oi.id,
                 greatest(oi.unit_quantity - oi.cancelled_quantity - oi.fulfilled_quantity, 0)::int as required_units,
                 coalesce(sum(a.quantity_units) filter (where a.status='picked'),0)::int as picked_units
            from public.order_items oi
            left join public.order_item_lot_allocations a on a.order_item_id=oi.id
           where oi.order_id=$1
           group by oi.id
        )
        select
          count(*) filter (where required_units > 0)::int as active_items,
          count(*) filter (where required_units > picked_units)::int as missing_items,
          coalesce(sum(required_units),0)::int as required_units,
          coalesce(sum(picked_units),0)::int as picked_units
        from item_status
      `, [order.id]);
      const summary = readiness.rows[0];
      const packed = Number(summary.active_items ?? 0) > 0 && Number(summary.missing_items ?? 0) === 0;
      await client.query(`
        update public.orders
           set fulfillment_status=$2
         where id=$1
      `, [order.id, packed ? "packed" : "picking"]);

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,'order.carton_picked','order',$2,$3::jsonb)
      `, [user.user_id, String(order.id), JSON.stringify({
        carton_code: carton.carton_code,
        allocation_id: allocation.rows[0].id,
        order_item_id: item.id,
        product_name: carton.product_name,
        lot_number: carton.lot_number,
        quantity_units: cartonUnits,
        fulfillment_status: packed ? "packed" : "picking"
      })]);

      return {
        carton_code: carton.carton_code,
        product_name: carton.product_name,
        product_code: carton.product_code,
        lot_number: carton.lot_number,
        location_name: carton.location_name,
        quantity_units: cartonUnits,
        missing_after: Math.max(0, missing - cartonUnits),
        fulfillment_status: packed ? "packed" : "picking"
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    return apiError(error, "A karton rendeléshez rendelése sikertelen.");
  }
}

const releaseSchema = z.object({
  allocationId: z.number().int().positive()
});

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await apiUser(PICK_ROLES);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) return NextResponse.json({ error: "Hibás rendelésazonosító." }, { status: 400 });

  try {
    const input = releaseSchema.parse(await request.json());
    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);

      const orderResult = await client.query<OrderRow>(`
        select id,organization_id,status,fulfillment_status
          from public.orders
         where id=$1 and archived_at is null
         for update
      `, [orderId]);
      const order = orderResult.rows[0];
      if (!order || order.organization_id !== user.organization_id) throw new Error("A rendelés nem található.");
      if (["delivered", "cancelled"].includes(order.fulfillment_status) || ["closed", "cancelled", "void"].includes(order.status)) {
        throw new Error("Lezárt vagy átadott rendelésből karton nem vonható vissza ezzel a művelettel.");
      }

      const allocationResult = await client.query<any>(`
        select a.*,oi.order_id,oi.product_name_snapshot,c.carton_code,c.status as carton_status,
               p.code as product_code,l.lot_number
          from public.order_item_lot_allocations a
          join public.order_items oi on oi.id=a.order_item_id
          join public.products p on p.id=oi.product_id
          join public.lots l on l.id=a.lot_id
          left join public.inventory_cartons c on c.id=a.carton_id
         where a.id=$1 and oi.order_id=$2
         limit 1
         for update of a
      `, [input.allocationId, order.id]);
      const allocation = allocationResult.rows[0];
      if (!allocation) throw new Error("Az összekészített karton nem található ezen a rendelésen.");
      if (!allocation.carton_id || !allocation.carton_code) {
        throw new Error("Csak konkrét kartonhoz kötött összekészítés vonható vissza itt.");
      }
      if (!["allocated", "picked"].includes(allocation.status)) {
        throw new Error("Csak még nem átadott karton összekészítése vonható vissza.");
      }

      await client.query(`update public.order_item_lot_allocations set status='released' where id=$1`, [allocation.id]);
      await client.query(`update public.inventory_cartons set status='in_stock' where id=$1`, [allocation.carton_id]);
      await client.query(`
        insert into public.inventory_carton_events(
          organization_id,carton_id,event_type,from_location_id,order_id,order_item_id,actor_user_id,note,event_data
        ) values($1,$2,'unpicked',$3,$4,$5,$6,'Rendelési összekészítés visszavonva',$7::jsonb)
      `, [
        order.organization_id,
        allocation.carton_id,
        allocation.location_id,
        order.id,
        allocation.order_item_id,
        user.user_id,
        JSON.stringify({ allocation_id: allocation.id, quantity_units: Number(allocation.quantity_units) })
      ]);

      const readiness = await client.query<any>(`
        with item_status as (
          select oi.id,
                 greatest(oi.unit_quantity - oi.cancelled_quantity - oi.fulfilled_quantity, 0)::int as required_units,
                 oi.reserved_quantity::int as reserved_units,
                 coalesce(sum(a.quantity_units) filter (where a.status='picked'),0)::int as picked_units
            from public.order_items oi
            left join public.order_item_lot_allocations a on a.order_item_id=oi.id
           where oi.order_id=$1
           group by oi.id
        )
        select
          count(*) filter (where required_units > 0)::int as active_items,
          count(*) filter (where required_units > picked_units)::int as missing_items,
          coalesce(sum(required_units),0)::int as required_units,
          coalesce(sum(reserved_units),0)::int as reserved_units,
          coalesce(sum(picked_units),0)::int as picked_units
        from item_status
      `, [order.id]);
      const summary = readiness.rows[0];
      const activeItems = Number(summary.active_items ?? 0);
      const missingItems = Number(summary.missing_items ?? 0);
      const pickedUnits = Number(summary.picked_units ?? 0);
      const reservedUnits = Number(summary.reserved_units ?? 0);
      const requiredUnits = Number(summary.required_units ?? 0);
      const nextFulfillment = activeItems > 0 && missingItems === 0
        ? "packed"
        : pickedUnits > 0
          ? "picking"
          : reservedUnits >= requiredUnits && requiredUnits > 0
            ? "reserved"
            : reservedUnits > 0
              ? "partially_reserved"
              : "unreserved";

      await client.query(`update public.orders set fulfillment_status=$2 where id=$1`, [order.id, nextFulfillment]);

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,'order.carton_unpicked','order',$2,$3::jsonb)
      `, [user.user_id, String(order.id), JSON.stringify({
        allocation_id: allocation.id,
        carton_code: allocation.carton_code,
        product_name: allocation.product_name_snapshot,
        product_code: allocation.product_code,
        lot_number: allocation.lot_number,
        quantity_units: Number(allocation.quantity_units),
        fulfillment_status: nextFulfillment
      })]);

      return {
        allocation_id: allocation.id,
        carton_code: allocation.carton_code,
        product_name: allocation.product_name_snapshot,
        lot_number: allocation.lot_number,
        quantity_units: Number(allocation.quantity_units),
        fulfillment_status: nextFulfillment
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    return apiError(error, "A karton összekészítés visszavonása sikertelen.");
  }
}
