import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase/admin";
import { generateTemporaryPassword } from "@/lib/password";

const schema = z.object({
  name: z.string().min(2).max(250),
  billingName: z.string().max(250).optional().default(""),
  taxNumber: z.string().max(50).optional().default(""),
  contactName: z.string().max(200).optional().default(""),
  email: z.string().email().refine((value) => value.includes("@") && value.includes("."), "Az e-mail-címben @ és . karakter szükséges."),
  phone: z.string().regex(/^\d*$/, "A telefonszám csak számokat tartalmazhat.").max(30).optional().default(""),
  postalCode: z.string().regex(/^\d{4}$/, "Az irányítószám pontosan 4 számjegy legyen."),
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

const updateSchema = schema.extend({
  id: z.number().int().positive(),
  active: z.boolean().default(true),
  creditLimitHuf: z.number().int().min(0).max(999999999).optional().default(0)
});

const passwordResetSchema = z.object({
  id: z.number().int().positive()
});

const deleteSchema = z.object({
  id: z.number().int().positive(),
  reason: z.string().min(5).max(1000),
  confirm: z.literal(true)
});

function deliveryWeekdaysFromInput(input: z.infer<typeof schema>) {
  const weekdays = input.deliveryWeekdays?.length ? input.deliveryWeekdays : input.deliveryWeekday ? [input.deliveryWeekday] : [];
  return [...new Set(weekdays)].sort((a, b) => a - b);
}

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
    const temporaryPassword = generateTemporaryPassword();
    const deliveryWeekdays = deliveryWeekdaysFromInput(input);
    if (!deliveryWeekdays.length) throw new Error("Legalább egy szállítási nap kiválasztása kötelező.");

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
        insert into public.app_users(
          user_id,email,display_name,role,partner_id,active,organization_id,
          password_change_required,temporary_password_hash,temporary_password_plain,temporary_password_set_at,temporary_password_expires_at
        )
        values($1,$2,$3,'partner',$4,true,$5,true,crypt($6,gen_salt('bf')),$6,now(),now()+interval '8 days')
        on conflict(user_id) do update set
          email=excluded.email,
          display_name=excluded.display_name,
          role='partner',
          partner_id=excluded.partner_id,
          active=true,
          organization_id=excluded.organization_id,
          password_change_required=true,
          temporary_password_hash=excluded.temporary_password_hash,
          temporary_password_plain=excluded.temporary_password_plain,
          temporary_password_set_at=excluded.temporary_password_set_at,
          temporary_password_expires_at=excluded.temporary_password_expires_at,
          password_changed_at=null
      `,[authUserId,accountEmail,input.contactName || input.name,row.id,user.organization_id,temporaryPassword]);
      await client.query(`insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data) values($1,'partner.created','partner',$2,$3::jsonb)`,[user.user_id,String(row.id),JSON.stringify(row)]);
      return row;
    });
    return NextResponse.json({ partner, username: accountEmail, temporaryPassword, temporaryPasswordExpiresInDays: 8 },{status:201});
  }catch(error){
    if (createdUserId) {
      await createSupabaseAdminClient().auth.admin.deleteUser(createdUserId).catch(() => undefined);
    }
    return apiError(error,"A partner létrehozása sikertelen.");
  }
}

export async function PUT(request: Request) {
  const auth = await apiUser(["admin", "management", "sales"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;
  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ error: "A Supabase admin kulcs nincs beállítva." }, { status: 503 });
  }

  try {
    const input = passwordResetSchema.parse(await request.json());
    const temporaryPassword = generateTemporaryPassword();
    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);
      const partnerUser = await client.query<{ user_id: string; email: string; display_name: string | null; partner_name: string }>(`
        select au.user_id,au.email,au.display_name,p.name as partner_name
          from public.app_users au
          join public.partners p on p.id=au.partner_id
         where au.role='partner'
           and au.partner_id=$1
           and au.organization_id=$2
           and p.archived_at is null
         order by au.created_at desc
         limit 1
      `, [input.id, user.organization_id]);
      const row = partnerUser.rows[0];
      if (!row) throw new Error("A partneri belépés nem található.");

      const { error } = await createSupabaseAdminClient().auth.admin.updateUserById(row.user_id, {
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: { display_name: row.display_name || row.partner_name }
      });
      if (error) throw new Error(error.message);

      await client.query(`
        update public.app_users
           set password_change_required=true,
               temporary_password_hash=crypt($2,gen_salt('bf')),
               temporary_password_plain=$2,
               temporary_password_set_at=now(),
               temporary_password_expires_at=now()+interval '8 days',
               password_changed_at=null
         where user_id=$1
      `, [row.user_id, temporaryPassword]);

      await client.query(`
        insert into public.notifications(organization_id,role_code,type,title,body,entity_type,entity_id)
        values($1,'admin','partner.password.reset','Partner ideiglenes jelszó újragenerálva',$2,'partner',$3)
      `, [user.organization_id, `${row.partner_name} új ideiglenes jelszót kapott.`, String(input.id)]);

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,'partner.password.reset','partner',$2,$3::jsonb)
      `, [user.user_id, String(input.id), JSON.stringify({ email: row.email, temporaryPasswordExpiresInDays: 8 })]);

      return row;
    });

    return NextResponse.json({
      username: result.email,
      temporaryPassword,
      temporaryPasswordExpiresInDays: 8
    });
  } catch (error) {
    return apiError(error, "Az ideiglenes jelszó újragenerálása sikertelen.");
  }
}

export async function PATCH(request: Request) {
  const auth = await apiUser(["admin", "management", "sales"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = updateSchema.parse(await request.json());
    const accountEmail = input.email.trim().toLowerCase();
    const deliveryWeekdays = deliveryWeekdaysFromInput(input);
    if (!deliveryWeekdays.length) throw new Error("Legalább egy szállítási nap kiválasztása kötelező.");

    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);
      const beforeResult = await client.query<any>(`
        select * from public.partners
         where id=$1 and organization_id=$2 and archived_at is null
         for update
      `, [input.id, user.organization_id]);
      const before = beforeResult.rows[0];
      if (!before) throw new Error("A partner nem található.");

      const duplicatePartner = await client.query(`
        select 1 from public.partners
         where lower(trim(name))=lower(trim($1)) and id<>$2 and archived_at is null
         limit 1
      `, [input.name, input.id]);
      if (duplicatePartner.rowCount) throw new Error("Már létezik ilyen nevű partner.");

      const duplicateUser = await client.query(`
        select 1 from public.app_users
         where lower(email)=lower($1)
           and not (role='partner' and partner_id=$2)
         limit 1
      `, [accountEmail, input.id]);
      if (duplicateUser.rowCount) throw new Error("Már létezik ilyen e-mail-című felhasználó.");

      const partnerUser = await client.query<{ user_id: string; email: string | null }>(`
        select user_id,email from public.app_users
         where role='partner' and partner_id=$1
         order by created_at desc
         limit 1
      `, [input.id]);

      if (partnerUser.rows[0] && partnerUser.rows[0].email?.toLowerCase() !== accountEmail && !hasSupabaseAdminConfig()) {
        throw new Error("A Supabase admin kulcs nincs beállítva, ezért a partneri belépési e-mail nem módosítható.");
      }
      if (partnerUser.rows[0] && partnerUser.rows[0].email?.toLowerCase() !== accountEmail) {
        const { error } = await createSupabaseAdminClient().auth.admin.updateUserById(partnerUser.rows[0].user_id, {
          email: accountEmail,
          email_confirm: true,
          user_metadata: { display_name: input.contactName || input.name }
        });
        if (error) throw new Error(error.message);
      }

      const shippingAddress = `${input.postalCode} ${input.city}, ${input.addressLine1}`;
      const updated = await client.query<any>(`
        update public.partners set
          name=$2,
          billing_name=$3,
          tax_number=$4,
          shipping_address=$5,
          contact_name=$6,
          email=$7,
          phone=$8,
          note=$9,
          active=$10,
          default_payment_method=$11,
          payment_terms_days=$12,
          minimum_order_cartons=$13,
          credit_limit_huf=$14,
          overdue_policy=$15,
          updated_at=now()
        where id=$1 and organization_id=$16 and archived_at is null
        returning *
      `, [
        input.id, input.name.trim(), input.billingName || null, input.taxNumber || null,
        shippingAddress, input.contactName || null, accountEmail, input.phone || null,
        input.note || null, input.active, input.paymentMethod, input.paymentTermsDays,
        input.minimumOrderCartons, input.creditLimitHuf ?? 0, input.overduePolicy, user.organization_id
      ]);

      const addressUpdate = await client.query(`
        update public.partner_addresses
           set postal_code=$2,city=$3,address_line1=$4,is_default=true,active=true,updated_at=now()
         where id=(
           select id from public.partner_addresses
            where partner_id=$1 and active=true
            order by is_default desc,id
            limit 1
         )
      `, [input.id, input.postalCode, input.city, input.addressLine1]);
      if (!addressUpdate.rowCount) {
        await client.query(`
          insert into public.partner_addresses(partner_id,name,postal_code,city,address_line1,is_default,active)
          values($1,'Fő üzlet',$2,$3,$4,true,true)
        `, [input.id, input.postalCode, input.city, input.addressLine1]);
      }

      if (input.contactName) {
        const contactUpdate = await client.query(`
          update public.partner_contacts
             set name=$2,email=$3,phone=$4,active=true
           where id=(
             select id from public.partner_contacts
              where partner_id=$1 and active=true
              order by id
              limit 1
           )
        `, [input.id, input.contactName, accountEmail, input.phone || null]);
        if (!contactUpdate.rowCount) {
          await client.query(`
            insert into public.partner_contacts(partner_id,name,role_type,email,phone)
            values($1,$2,'general',$3,$4)
          `, [input.id, input.contactName, accountEmail, input.phone || null]);
        }
      }

      await client.query(`update public.partner_delivery_days set active=false where partner_id=$1`, [input.id]);
      for (const weekday of deliveryWeekdays) {
        await client.query(`
          insert into public.partner_delivery_days(partner_id,weekday,cutoff_business_days,active)
          values($1,$2,$3,true)
          on conflict(partner_id,weekday) do update set cutoff_business_days=excluded.cutoff_business_days,active=true,updated_at=now()
        `, [input.id, weekday, input.cutoffBusinessDays]);
      }

      await client.query(`
        update public.app_users
           set email=$2,display_name=$3,active=$4,organization_id=$5
         where role='partner' and partner_id=$1
      `, [input.id, accountEmail, input.contactName || input.name, input.active, user.organization_id]);

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,before_data,after_data)
        values($1,'partner.updated','partner',$2,$3::jsonb,$4::jsonb)
      `, [user.user_id, String(input.id), JSON.stringify(before), JSON.stringify(updated.rows[0])]);

      return updated.rows[0];
    });

    return NextResponse.json({ partner: result });
  } catch (error) {
    return apiError(error, "A partner mentése sikertelen.");
  }
}

export async function DELETE(request: Request) {
  const auth = await apiUser(["admin", "management"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = deleteSchema.parse(await request.json());
    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);
      const beforeResult = await client.query<any>(`
        select * from public.partners
         where id=$1 and organization_id=$2 and archived_at is null
         for update
      `, [input.id, user.organization_id]);
      const before = beforeResult.rows[0];
      if (!before) throw new Error("A partner nem található.");

      const archived = await client.query<any>(`
        update public.partners
           set active=false, archived_at=now(), note=concat_ws(E'\n', note, $3)
         where id=$1 and organization_id=$2 and archived_at is null
         returning *
      `, [input.id, user.organization_id, `Archiválva: ${input.reason.trim()}`]);

      await client.query(`update public.app_users set active=false where role='partner' and partner_id=$1`, [input.id]);
      await client.query(`update public.partner_addresses set active=false where partner_id=$1`, [input.id]);
      await client.query(`update public.partner_contacts set active=false where partner_id=$1`, [input.id]);
      await client.query(`update public.partner_delivery_days set active=false where partner_id=$1`, [input.id]);
      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,before_data,after_data)
        values($1,'partner.archived','partner',$2,$3::jsonb,$4::jsonb)
      `, [user.user_id, String(input.id), JSON.stringify(before), JSON.stringify({ reason: input.reason.trim(), partner: archived.rows[0] })]);

      return archived.rows[0];
    });

    return NextResponse.json({ partner: result });
  } catch (error) {
    return apiError(error, "A partner törlése sikertelen.");
  }
}
