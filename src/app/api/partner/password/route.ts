import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { query } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  password: z.string().min(8).max(128)
});

export async function POST(request: Request) {
  const auth = await apiUser(["partner"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = schema.parse(await request.json());
    if (user.temporary_password_expires_at && new Date(user.temporary_password_expires_at) < new Date()) {
      throw new Error("Az ideiglenes jelszó lejárt. Kérj új jelszót a Gellamille munkatársától.");
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({ password: input.password });
    if (error) throw new Error(error.message);

    await query(`
      update public.app_users
         set password_change_required=false,
             temporary_password_hash=null,
             temporary_password_plain=null,
             temporary_password_set_at=null,
             temporary_password_expires_at=null,
             password_changed_at=now()
       where user_id=$1
    `, [user.user_id]);

    await query(`
      insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
      values($1,'partner.password.changed','app_user',$1,$2::jsonb)
    `, [user.user_id, JSON.stringify({ partner_id: user.partner_id })]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "A jelszó módosítása sikertelen.");
  }
}
