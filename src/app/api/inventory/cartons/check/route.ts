import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { query, transaction } from "@/lib/db";

const schema = z.object({
  code: z.string().trim().min(3).max(80)
});

export async function POST(request: Request) {
  const auth = await apiUser(["admin", "management", "staff", "production", "warehouse"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = schema.parse(await request.json());
    const carton = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);
      const cartonResult = await client.query<any>(`
        select c.id,c.carton_code,c.quantity_units,c.status,c.created_at,
               p.name as product_name,p.code as product_code,p.size_ml,
               l.lot_number,l.production_date,l.best_before,
               loc.name as location_name,loc.code as location_code,loc.type as location_type
          from public.inventory_cartons c
          join public.products p on p.id=c.product_id
          join public.lots l on l.id=c.lot_id
          left join public.inventory_locations loc on loc.id=c.location_id
         where c.organization_id=$1 and upper(c.carton_code)=upper($2) and c.archived_at is null and l.archived_at is null
         limit 1
      `, [user.organization_id, input.code]);

      const row = cartonResult.rows[0];
      if (!row) throw new Error("Nem található ilyen kartonkód.");

      await client.query(`
        insert into public.inventory_carton_events(organization_id,carton_id,event_type,actor_user_id,note)
        values($1,$2,'checked',$3,'Karton ellenőrző csippantás')
      `, [user.organization_id, row.id, user.user_id]);

      return row;
    });

    const events = await query<any>(`
      select e.event_type,e.note,e.created_at,e.event_data,
             from_loc.name as from_location_name,
             to_loc.name as to_location_name,
             au.display_name as actor_name,
             o.order_number
        from public.inventory_carton_events e
        left join public.inventory_locations from_loc on from_loc.id=e.from_location_id
        left join public.inventory_locations to_loc on to_loc.id=e.to_location_id
        left join public.app_users au on au.user_id=e.actor_user_id
        left join public.orders o on o.id=e.order_id
       where e.organization_id=$1 and e.carton_id=$2 and e.archived_at is null
       order by e.created_at desc
       limit 25
    `, [user.organization_id, carton.id]);

    return NextResponse.json({ carton, events });
  } catch (error) {
    return apiError(error, "A karton ellenőrzése sikertelen.");
  }
}
