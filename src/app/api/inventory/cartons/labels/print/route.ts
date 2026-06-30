import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";

const schema = z.object({
  lotId: z.coerce.number().int().positive(),
  cartonIds: z.array(z.coerce.number().int().positive()).min(1)
});

export async function POST(request: Request) {
  const auth = await apiUser(["admin", "management", "production", "warehouse"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = schema.parse(await request.json());
    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);

      const cartons = await client.query<{ id: number; printed_before: boolean }>(`
        select c.id,
               exists (
                 select 1 from public.inventory_carton_events e
                  where e.organization_id=c.organization_id and e.carton_id=c.id and e.event_type in ('label_printed','label_reprinted') and e.archived_at is null
               ) as printed_before
         from public.inventory_cartons c
         join public.lots l on l.id=c.lot_id
         where c.organization_id=$1 and c.lot_id=$2 and c.id = any($3::bigint[]) and c.archived_at is null and l.archived_at is null
         order by c.id
         for update of c
      `, [user.organization_id, input.lotId, input.cartonIds]);

      if (cartons.rowCount !== input.cartonIds.length) {
        throw new Error("Nem minden címkézendő karton található ebben a LOT-ban.");
      }

      for (const carton of cartons.rows) {
        await client.query(`
          insert into public.inventory_carton_events(organization_id,carton_id,event_type,actor_user_id,note,event_data)
          values($1,$2,$3,$4,$5,$6::jsonb)
        `, [
          user.organization_id,
          carton.id,
          carton.printed_before ? "label_reprinted" : "label_printed",
          user.user_id,
          carton.printed_before ? "Karton címke újranyomtatása indítva" : "Karton címke nyomtatása indítva",
          JSON.stringify({ lot_id: input.lotId, print_requested_at: new Date().toISOString() })
        ]);
      }

      return { printed: cartons.rowCount };
    });

    return NextResponse.json(result);
  } catch (error) {
    return apiError(error, "A címkenyomtatás naplózása sikertelen.");
  }
}
