import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";

const schema = z.object({
  lotId: z.number().int().positive()
});

export async function POST(request: Request) {
  const auth = await apiUser(["admin", "management", "production", "warehouse"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = schema.parse(await request.json());
    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);

      const lotResult = await client.query(`
        select l.id,l.quantity,l.status,l.lot_number,l.organization_id,
               p.id as product_id,p.name as product_name,p.units_per_carton
          from public.lots l
          join public.products p on p.flavor_code=l.flavor_code and p.size_ml=l.size_ml and p.organization_id=l.organization_id
         where l.id=$1 and l.organization_id=$2 and l.archived_at is null
         for update of l
      `, [input.lotId, user.organization_id]);
      const lot = lotResult.rows[0];
      if (!lot) throw new Error("A LOT nem található.");
      if (lot.status !== "active") throw new Error("Csak aktív LOT kartonozható.");

      const unitsPerCarton = Number(lot.units_per_carton ?? 0);
      if (!Number.isInteger(unitsPerCarton) || unitsPerCarton <= 0) {
        throw new Error("A termék karton kiszerelése nincs beállítva.");
      }

      const locationResult = await client.query(`
        select id from public.inventory_locations
         where organization_id=$1 and code='CENTRAL' and active=true
      `, [user.organization_id]);
      const location = locationResult.rows[0];
      if (!location) throw new Error("A Központi raktár nincs beállítva.");

      const existingResult = await client.query(`
        select coalesce(sum(quantity_units),0)::int as carton_units
          from public.inventory_cartons
         where organization_id=$1 and lot_id=$2 and archived_at is null
      `, [user.organization_id, lot.id]);
      const existingUnits = Number(existingResult.rows[0]?.carton_units ?? 0);
      const remainingUnits = Number(lot.quantity ?? 0) - existingUnits;
      if (remainingUnits <= 0) throw new Error("Ehhez a LOT-hoz már nincs kartonozatlan mennyiség.");

      const fullCartons = Math.floor(remainingUnits / unitsPerCarton);
      const remainderUnits = remainingUnits % unitsPerCarton;
      const cartonQuantities = [
        ...Array.from({ length: fullCartons }, () => unitsPerCarton),
        ...(remainderUnits > 0 ? [remainderUnits] : [])
      ];

      const generated = await client.query(`
        with inserted as (
          insert into public.inventory_cartons(
            organization_id,product_id,lot_id,location_id,quantity_units,status,created_by
          )
          select $1,$2,$3,$4,quantity_units,'in_stock',$5
            from unnest($6::integer[]) as carton(quantity_units)
          returning id,carton_code,quantity_units
        ), logged as (
          insert into public.inventory_carton_events(
            organization_id,carton_id,event_type,to_location_id,actor_user_id,note,event_data
          )
          select $1,id,'created',$4,$5,'Kartonozás és címkegenerálás során létrehozott karton',
                 jsonb_build_object('lot_id',$3,'quantity_units',quantity_units)
            from inserted
          returning id
        )
        select count(*)::int as carton_count,
               coalesce(sum(quantity_units),0)::int as carton_units,
               min(carton_code) as first_carton_code,
               max(carton_code) as last_carton_code,
               array_agg(id order by carton_code) as carton_ids
          from inserted
      `, [user.organization_id, lot.product_id, lot.id, location.id, user.user_id, cartonQuantities]);

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,'inventory.cartons.generated_for_lot','lot',$2,$3::jsonb)
      `, [user.user_id, String(lot.id), JSON.stringify({
        lot_number: lot.lot_number,
        product_name: lot.product_name,
        generated: generated.rows[0],
        remaining_units_before: remainingUnits,
        units_per_carton: unitsPerCarton
      })]);

      return generated.rows[0];
    });

    return NextResponse.json(result);
  } catch (error) {
    return apiError(error, "A kartoncímkék generálása sikertelen.");
  }
}
