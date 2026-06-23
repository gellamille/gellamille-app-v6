import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { query } from "@/lib/db";
import { generateTemporaryPassword } from "@/lib/password";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase/admin";

const roleSchema = z.enum(["admin", "management", "staff", "production", "warehouse", "finance", "sales"]);

const schema = z.object({
  email: z.string().email(),
  displayName: z.string().min(2).max(200),
  role: roleSchema
});

export async function POST(request: Request) {
  const auth = await apiUser(["admin"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ error: "A Supabase admin kulcs nincs beállítva." }, { status: 503 });
  }

  let createdUserId: string | null = null;

  try {
    const input = schema.parse(await request.json());
    const email = input.email.trim().toLowerCase();
    const existing = await query(`select 1 from public.app_users where lower(email)=lower($1)`, [email]);
    if (existing.length) throw new Error("Már létezik ilyen e-mail-című felhasználó.");

    const temporaryPassword = generateTemporaryPassword();
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: { display_name: input.displayName.trim() },
      app_metadata: { gellamille_role: input.role }
    });

    if (error || !data.user) throw new Error(error?.message ?? "Az Auth felhasználó létrehozása sikertelen.");
    createdUserId = data.user.id;

    const rows = await query<any>(`
      insert into public.app_users(user_id,email,display_name,role,partner_id,active,organization_id)
      values($1,$2,$3,$4,null,true,$5)
      on conflict(user_id) do update set
        email=excluded.email,
        display_name=excluded.display_name,
        role=excluded.role,
        partner_id=null,
        active=true,
        organization_id=excluded.organization_id
      returning user_id,email,display_name,role,active,organization_id
    `, [createdUserId, email, input.displayName.trim(), input.role, user.organization_id]);

    await query(`
      insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
      values($1,'user.created','app_user',$2,$3::jsonb)
    `, [user.user_id, createdUserId, JSON.stringify({ email, role: input.role, display_name: input.displayName.trim() })]);

    return NextResponse.json({
      user: rows[0],
      temporaryPassword
    }, { status: 201 });
  } catch (error) {
    if (createdUserId) {
      await createSupabaseAdminClient().auth.admin.deleteUser(createdUserId).catch(() => undefined);
    }
    return apiError(error, "A felhasználó létrehozása sikertelen.");
  }
}
