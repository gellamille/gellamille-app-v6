import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { query } from "@/lib/db";

const schema = z.object({
  eventType: z.enum(["new_order", "order_changed", "order_updated", "order_deleted", "product_recall"]).default("new_order"),
  name: z.string().max(200).optional().default(""),
  email: z.string().email()
});

export async function POST(request: Request) {
  const auth = await apiUser(["admin"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = schema.parse(await request.json());
    const rows = await query<any>(`
      insert into public.notification_recipients(organization_id,event_type,name,email,active)
      values($1,$2,$3,$4,true)
      on conflict(organization_id,event_type,email) do update set
        name=excluded.name,
        active=true
      returning *
    `, [user.organization_id, input.eventType, input.name.trim() || null, input.email.trim().toLowerCase()]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return apiError(error, "Az e-mail címzett mentése sikertelen.");
  }
}
