import { PageHeader } from "@/components/PageHeader";
import { query } from "@/lib/db";
import { NewPartnerForm } from "./NewPartnerForm";
import { PartnerDirectory } from "./PartnerDirectory";
import { requireAppUser } from "@/lib/auth";

export default async function PartnersPage() {
  const user = await requireAppUser(["admin","management","sales","finance"]);
  const canWrite = ["admin","management","sales"].includes(user.role);
  const canDelete = ["admin","management"].includes(user.role);
  const partners = await query<any>(`
    select p.id,p.name,p.billing_name,p.tax_number,p.shipping_address,p.contact_name,p.email,p.phone,p.note,p.active,p.payment_terms_days,
           p.default_payment_method,p.minimum_order_cartons,p.credit_limit_huf,p.overdue_policy,
           pa.postal_code,pa.city,pa.address_line1,
           (select max(o.created_at) from public.orders o where o.partner_id=p.id and o.archived_at is null) as last_order_at,
           (select coalesce(sum(r.gross_amount_huf),0) from public.receivables r where r.partner_id=p.id and r.status<>'void' and r.archived_at is null)::bigint as total_revenue,
           (select coalesce(sum(v.outstanding_huf),0) from public.v_receivables_open v where v.partner_id=p.id)::bigint as outstanding,
           (select string_agg(case d.weekday when 1 then 'Hétfő' when 2 then 'Kedd' when 3 then 'Szerda' when 4 then 'Csütörtök' when 5 then 'Péntek' when 6 then 'Szombat' else 'Vasárnap' end, ', ' order by d.weekday)
              from public.partner_delivery_days d where d.partner_id=p.id and d.active=true) as delivery_days,
           coalesce((select array_agg(d.weekday::int order by d.weekday) from public.partner_delivery_days d where d.partner_id=p.id and d.active=true),'{}'::int[]) as delivery_weekdays,
           coalesce((select max(d.cutoff_business_days) from public.partner_delivery_days d where d.partner_id=p.id and d.active=true),2)::int as cutoff_business_days
      from public.partners p
      left join lateral (
        select postal_code,city,address_line1
          from public.partner_addresses pa
         where pa.partner_id=p.id and pa.active=true
         order by pa.is_default desc,pa.id
         limit 1
      ) pa on true
     where p.archived_at is null
     order by p.name
  `);
  return (
    <div className="page">
      <PageHeader title="Partnerek" description="Egy partnerhez egy belépés, több szállítási cím és több kapcsolattartó tartozhat." actions={canWrite ? <NewPartnerForm /> : undefined} />
      <PartnerDirectory partners={partners} canWrite={canWrite} canDelete={canDelete} />
    </div>
  );
}
