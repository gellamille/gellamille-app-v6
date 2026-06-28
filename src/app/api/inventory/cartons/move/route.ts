import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";

const schema = z.object({
  code: z.string().trim().min(3).max(80),
  toLocationId: z.number().int().positive(),
  note: z.string().trim().max(500).optional().default("")
});

const movableStatuses = new Set(["created", "in_stock", "reserved"]);

export async function POST(request: Request) {
  const auth = await apiUser(["admin", "management", "warehouse", "production"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = schema.parse(await request.json());
    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);

      const cartonResult = await client.query<any>(`
        select c.*,p.name as product_name,p.code as product_code,l.lot_number,l.purchase_unit_price_huf,
               from_loc.name as from_location_name
          from public.inventory_cartons c
          join public.products p on p.id=c.product_id
          join public.lots l on l.id=c.lot_id
          left join public.inventory_locations from_loc on from_loc.id=c.location_id
         where c.organization_id=$1 and upper(c.carton_code)=upper($2) and c.archived_at is null
         limit 1
         for update of c
      `, [user.organization_id, input.code]);
      const carton = cartonResult.rows[0];
      if (!carton) throw new Error("Nem található ilyen kartonkód.");
      if (!movableStatuses.has(carton.status)) {
        throw new Error("Ez a karton ebben az állapotban nem mozgatható raktárhelyek között.");
      }
      if (!carton.location_id) {
        throw new Error("A kartonnak nincs kiinduló raktárhelye.");
      }
      if (Number(carton.location_id) === input.toLocationId) {
        throw new Error("A karton már ezen a raktárhelyen van.");
      }

      const toLocationResult = await client.query<any>(`
        select id,name,type
          from public.inventory_locations
         where id=$1 and organization_id=$2 and active=true
         limit 1
      `, [input.toLocationId, user.organization_id]);
      const toLocation = toLocationResult.rows[0];
      if (!toLocation) throw new Error("A cél raktárhely nem található vagy inaktív.");
      if (toLocation.type === "partner_consignment") {
        throw new Error("Partnerhez átadás raktári áthelyezéssel nem végezhető. Használd a rendelés átadási folyamatát.");
      }
      if (toLocation.type === "scrap") {
        throw new Error("Selejt helyre sima áthelyezéssel nem lehet mozgatni. Használd majd a selejtezési folyamatot indoklással.");
      }

      const quantity = Number(carton.quantity_units);
      const unitCost = Number(carton.purchase_unit_price_huf ?? 0);
      const reason = input.note || `Karton áthelyezés: ${carton.carton_code}`;

      await client.query(`
        insert into public.inventory_movements(
          organization_id,product_id,lot_id,location_id,movement_type,quantity_units,unit_cost_huf,reason,created_by
        ) values($1,$2,$3,$4,'transfer_out',$5,$6,$7,$8)
      `, [user.organization_id, carton.product_id, carton.lot_id, carton.location_id, -quantity, unitCost, reason, user.user_id]);

      await client.query(`
        insert into public.inventory_movements(
          organization_id,product_id,lot_id,location_id,movement_type,quantity_units,unit_cost_huf,reason,created_by
        ) values($1,$2,$3,$4,'transfer_in',$5,$6,$7,$8)
      `, [user.organization_id, carton.product_id, carton.lot_id, toLocation.id, quantity, unitCost, reason, user.user_id]);

      const updated = await client.query<any>(`
        update public.inventory_cartons
           set location_id=$2
         where id=$1
         returning carton_code,quantity_units,status
      `, [carton.id, toLocation.id]);

      await client.query(`
        insert into public.inventory_carton_events(
          organization_id,carton_id,event_type,from_location_id,to_location_id,actor_user_id,note,event_data
        ) values($1,$2,'moved',$3,$4,$5,$6,$7::jsonb)
      `, [
        user.organization_id,
        carton.id,
        carton.location_id,
        toLocation.id,
        user.user_id,
        input.note || null,
        JSON.stringify({ quantity_units: quantity, product_id: carton.product_id, lot_id: carton.lot_id })
      ]);

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,'carton.moved','inventory_carton',$2,$3::jsonb)
      `, [user.user_id, String(carton.id), JSON.stringify({
        carton_code: carton.carton_code,
        product_name: carton.product_name,
        lot_number: carton.lot_number,
        quantity_units: quantity,
        from_location_id: carton.location_id,
        from_location_name: carton.from_location_name,
        to_location_id: toLocation.id,
        to_location_name: toLocation.name
      })]);

      return {
        ...updated.rows[0],
        product_name: carton.product_name,
        product_code: carton.product_code,
        lot_number: carton.lot_number,
        from_location_name: carton.from_location_name,
        to_location_name: toLocation.name
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    return apiError(error, "A karton áthelyezése sikertelen.");
  }
}
