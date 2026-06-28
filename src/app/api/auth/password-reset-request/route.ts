import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { apiError } from "@/lib/http";

const schema = z.object({
  email: z.string().email()
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const email = input.email.trim().toLowerCase();
    const partners = await query<{ id: number; name: string; organization_id: number; email: string }>(`
      select p.id,p.name,p.organization_id,au.email
        from public.app_users au
        join public.partners p on p.id=au.partner_id
       where au.role='partner'
         and lower(au.email)=lower($1)
         and au.active=true
         and p.archived_at is null
       limit 1
    `, [email]);

    const partner = partners[0];
    if (partner) {
      await query(`
        insert into public.notifications(organization_id,role_code,type,title,body,entity_type,entity_id)
        values($1,'admin','partner.password.request','Partner jelszó-visszaállítást kért',$2,'partner',$3)
      `, [partner.organization_id, `${partner.name} (${partner.email}) új belépési jelszót kért.`, String(partner.id)]);

      await query(`
        insert into public.audit_log(action,entity_type,entity_id,after_data)
        values('partner.password.requested','partner',$1,$2::jsonb)
      `, [String(partner.id), JSON.stringify({ email: partner.email })]);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "A jelszó-visszaállítási kérés beküldése sikertelen.");
  }
}
