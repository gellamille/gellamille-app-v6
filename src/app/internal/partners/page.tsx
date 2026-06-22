import { PageHeader } from "@/components/PageHeader";
import { query } from "@/lib/db";
import { NewPartnerForm } from "./NewPartnerForm";
import { PartnerDirectory } from "./PartnerDirectory";
import { requireAppUser } from "@/lib/auth";

export default async function PartnersPage() {
  const user = await requireAppUser(["admin","management","sales","finance"]);
  const canWrite = ["admin","management","sales"].includes(user.role);
  const partners = await query<any>(`
    select p.id,p.name,p.email,p.phone,p.active,p.payment_terms_days,
           p.default_payment_method,p.minimum_order_cartons,p.credit_limit_huf,p.overdue_policy,
           (select max(o.created_at) from public.orders o where o.partner_id=p.id and o.archived_at is null) as last_order_at,
           (select coalesce(sum(r.gross_amount_huf),0) from public.receivables r where r.partner_id=p.id and r.status<>'void' and r.archived_at is null)::bigint as total_revenue,
           (select coalesce(sum(v.outstanding_huf),0) from public.v_receivables_open v where v.partner_id=p.id)::bigint as outstanding,
           (select string_agg(case d.weekday when 1 then 'Hétfő' when 2 then 'Kedd' when 3 then 'Szerda' when 4 then 'Csütörtök' when 5 then 'Péntek' when 6 then 'Szombat' else 'Vasárnap' end, ', ' order by d.weekday)
              from public.partner_delivery_days d where d.partner_id=p.id and d.active=true) as delivery_days
      from public.partners p
     where p.archived_at is null
     order by p.name
  `);
  return (
    <div className="page">
      <PageHeader title="Partnerek" description="Egy partnerhez egy belépés, több szállítási cím és több kapcsolattartó tartozhat." actions={canWrite ? <NewPartnerForm /> : undefined} />
      <PartnerDirectory partners={partners} />
    </div>
  );
}
