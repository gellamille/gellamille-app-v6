import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";
import { generateTemporaryPassword } from "@/lib/password";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase/admin";

const schema = z.object({
  name: z.string().min(2).max(250),
  billingName: z.string().max(250).optional().default(""),
  taxNumber: z.string().max(50).optional().default(""),
  contactName: z.string().max(200).optional().default(""),
  email: z.string().email(),
  phone: z.string().max(50).optional().default(""),
  postalCode: z.string().min(3).max(20),
  city: z.string().min(2).max(120),
  addressLine1: z.string().min(3).max(250),
  paymentMethod: z.enum(["cash_on_delivery", "card_on_delivery", "bank_transfer"]),
  paymentTermsDays: z.number().int().min(0).max(365),
  minimumOrderCartons: z.number().int().min(1).max(999),
  overduePolicy: z.enum(["warn", "block"]),
  deliveryWeekday: z.number().int().min(1).max(7).optional(),
  deliveryWeekdays: z.array(z.number().int().min(1).max(7)).min(1).optional(),
  cutoffBusinessDays: z.number().int().min(0).max(30).default(2),
  note: z.string().max(2000).optional().default("")
});

export async function POST(request: Request) {
  const auth=await apiUser(["admin","management","sales"]);
  if(auth.error||!auth.user) return auth.error??NextResponse.json({error:"Nincs jogosultság."},{status:401});
  const user=auth.user;
  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ error: "A Supabase admin kulcs nincs beállítva." }, { status: 503 });
  }

  let createdUserId: string | null = null;

  try{
    const input=schema.parse(await request.json());
    const accountEmail = input.email.trim().toLowerCase();
    const deliveryWeekdays = input.deliveryWeekdays?.length ? input.deliveryWeekdays : input.deliveryWeekday ? [input.deliveryWeekday] : [];
    if (!deliveryWeekdays.length) throw new Error("Legalább egy szállítási nap kiválasztása kötelező.");

    const temporaryPassword = generateTemporaryPassword();
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email: accountEmail,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: { display_name: input.contactName || input.name },
      app_metadata: { gellamille_role: "partner" }
    });
    if (error || !data.user) throw new Error(error?.message ?? "A partneri Auth felhasználó létrehozása sikertelen.");
    createdUserId = data.user.id;
    const authUserId = createdUserId;

    const partner=await transaction(async client=>{
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`,[user.user_id]);
      const duplicate=await client.query(`select 1 from public.partners where lower(trim(name))=lower(trim($1))`,[input.name]);
      if(duplicate.rowCount) throw new Error("Már létezik ilyen nevű partner.");
      const duplicateUser=await client.query(`select 1 from public.app_users where lower(email)=lower($1) and user_id<>$2`,[accountEmail,authUserId]);
      if(duplicateUser.rowCount) throw new Error("Már létezik ilyen e-mail-című felhasználó.");

      const shippingAddress=`${input.postalCode} ${input.city}, ${input.addressLine1}`;
      const result=await client.query<any>(`
        insert into public.partners(
          name,billing_name,tax_number,shipping_address,contact_name,email,phone,note,created_by,
          organization_id,active,default_payment_method,payment_terms_days,minimum_order_cartons,overdue_policy
        ) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true,$11,$12,$13,$14) returning *
      `,[input.name.trim(),input.billingName||null,input.taxNumber||null,shippingAddress,input.contactName||null,
        input.email||null,input.phone||null,input.note||null,user.user_id,user.organization_id,input.paymentMethod,
        input.paymentTermsDays,input.minimumOrderCartons,input.overduePolicy]);
      const row=result.rows[0];
      await client.query(`
        insert into public.partner_addresses(partner_id,name,postal_code,city,address_line1,is_default,active)
        values($1,'Fő üzlet',$2,$3,$4,true,true)
      `,[row.id,input.postalCode,input.city,input.addressLine1]);
      for (const weekday of deliveryWeekdays) {
        await client.query(`
          insert into public.partner_delivery_days(partner_id,weekday,cutoff_business_days,active)
          values($1,$2,$3,true)
          on conflict(partner_id,weekday) do update set cutoff_business_days=excluded.cutoff_business_days,active=true
        `,[row.id,weekday,input.cutoffBusinessDays]);
      }
      if(input.contactName){
        await client.query(`insert into public.partner_contacts(partner_id,name,role_type,email,phone) values($1,$2,'general',$3,$4)`,[row.id,input.contactName,input.email||null,input.phone||null]);
      }
      await client.query(`
        insert into public.app_users(user_id,email,display_name,role,partner_id,active,organization_id)
        values($1,$2,$3,'partner',$4,true,$5)
        on conflict(user_id) do update set
          email=excluded.email,
          display_name=excluded.display_name,
          role='partner',
          partner_id=excluded.partner_id,
          active=true,
          organization_id=excluded.organization_id
      `,[authUserId,accountEmail,input.contactName || input.name,row.id,user.organization_id]);
      await client.query(`insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data) values($1,'partner.created','partner',$2,$3::jsonb)`,[user.user_id,String(row.id),JSON.stringify(row)]);
      return row;
    });
    return NextResponse.json({ partner, username: accountEmail, temporaryPassword },{status:201});
  }catch(error){
    if (createdUserId) {
      await createSupabaseAdminClient().auth.admin.deleteUser(createdUserId).catch(() => undefined);
    }
    return apiError(error,"A partner létrehozása sikertelen.");
  }
}
