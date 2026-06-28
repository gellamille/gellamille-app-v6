import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { query } from "@/lib/db";

const schema = z.object({
  lowSurplusUnits: z.number().int().min(0).max(999999),
  mediumSurplusUnits: z.number().int().min(0).max(999999),
  highSurplusUnits: z.number().int().min(0).max(999999),
  overstockSurplusUnits: z.number().int().min(0).max(999999)
}).refine((value) => value.lowSurplusUnits <= value.mediumSurplusUnits, { message: "Az alacsony küszöb nem lehet magasabb a közepesnél." })
  .refine((value) => value.mediumSurplusUnits <= value.highSurplusUnits, { message: "A közepes küszöb nem lehet magasabb a magasnál." })
  .refine((value) => value.highSurplusUnits <= value.overstockSurplusUnits, { message: "A magas küszöb nem lehet magasabb a túlteljesítettnél." });

export async function PATCH(request: Request) {
  const auth = await apiUser(["admin", "management", "warehouse"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = schema.parse(await request.json());
    const rows = await query<any>(`
      insert into public.inventory_stock_settings(
        organization_id,low_surplus_units,medium_surplus_units,high_surplus_units,overstock_surplus_units,updated_by,updated_at
      )
      values($1,$2,$3,$4,$5,$6,now())
      on conflict(organization_id) do update set
        low_surplus_units=excluded.low_surplus_units,
        medium_surplus_units=excluded.medium_surplus_units,
        high_surplus_units=excluded.high_surplus_units,
        overstock_surplus_units=excluded.overstock_surplus_units,
        updated_by=excluded.updated_by,
        updated_at=now()
      returning *
    `, [user.organization_id, input.lowSurplusUnits, input.mediumSurplusUnits, input.highSurplusUnits, input.overstockSurplusUnits, user.user_id]);
    await query(`
      insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
      values($1,'inventory.settings.updated','inventory_stock_settings',$2,$3::jsonb)
    `, [user.user_id, String(user.organization_id), JSON.stringify(rows[0])]);
    return NextResponse.json(rows[0]);
  } catch (error) {
    return apiError(error, "A készletbeállítások mentése sikertelen.");
  }
}
