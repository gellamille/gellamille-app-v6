import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2).max(250),
  billingName: z.string().max(250).optional().default(""),
  taxNumber: z.string().max(50).optional().default(""),
  contactName: z.string().max(200).optional().default(""),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(50).optional().default(""),
  postalCode: z.string().min(3).max(20),
  city: z.string().min(2).max(120),
  addressLine1: z.string().min(3).max(250),
  paymentMethod: z.enum(["cash_on_delivery", "card_on_delivery", "bank_transfer"]),
  paymentTermsDays: z.number().int().min(0).max(365),
  minimumOrderCartons: z.number().int().min(1).max(999),
  overduePolicy: z.enum(["warn", "block"]),
  deliveryWeekday: z.number().int().min(1).max(7),
  cutoffBusinessDays: z.number().int().min(0).max(30).default(2),
  note: z.string().max(2000).optional().default("")
});

export async function POST(request: Request) {
  const auth=await apiUser(["admin","management","sales"]);
  if(auth.error||!auth.user) return auth.error??NextResponse.json({error:"Nincs jogosultság."},{status:401});
  const user=auth.user;
  try{
    const input=schema.parse(await request.json());
    const partner=await transaction(async client=>{
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`,[user.user_id]);
      const duplicate=await client.query(`select 1 from public.partners where lower(trim(name))=lower(trim($1))`,[input.name]);
      if(duplicate.rowCount) throw new Error("Már létezik ilyen nevű partner.");
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
      await client.query(`
        insert into public.partner_delivery_days(partner_id,weekday,cutoff_business_days,active)
        values($1,$2,$3,true)
        on conflict(partner_id,weekday) do update set cutoff_business_days=excluded.cutoff_business_days,active=true
      `,[row.id,input.deliveryWeekday,input.cutoffBusinessDays]);
      if(input.contactName){
        await client.query(`insert into public.partner_contacts(partner_id,name,role_type,email,phone) values($1,$2,'general',$3,$4)`,[row.id,input.contactName,input.email||null,input.phone||null]);
      }
      await client.query(`insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data) values($1,'partner.created','partner',$2,$3::jsonb)`,[user.user_id,String(row.id),JSON.stringify(row)]);
      return row;
    });
    return NextResponse.json(partner,{status:201});
  }catch(error){return apiError(error,"A partner létrehozása sikertelen.");}
}
