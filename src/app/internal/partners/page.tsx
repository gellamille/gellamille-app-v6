import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { dateHU, money } from "@/lib/format";
import { NewPartnerForm } from "./NewPartnerForm";
import { currentAppUser } from "@/lib/auth";

export default async function PartnersPage() {
  const user = await currentAppUser();
  const canWrite = !!user && ["admin","management","sales"].includes(user.role);
  const partners = await query<any>(`
    select p.id,p.name,p.email,p.phone,p.active,p.payment_terms_days,
           p.default_payment_method,p.minimum_order_cartons,p.credit_limit_huf,p.overdue_policy,
           (select max(o.created_at) from public.orders o where o.partner_id=p.id) as last_order_at,
           (select coalesce(sum(r.gross_amount_huf),0) from public.receivables r where r.partner_id=p.id and r.status<>'void')::bigint as total_revenue,
           (select coalesce(sum(v.outstanding_huf),0) from public.v_receivables_open v where v.partner_id=p.id)::bigint as outstanding
      from public.partners p
     order by p.name
  `);
  return (
    <div className="page">
      <PageHeader title="Partnerek" description="Egy partnerhez egy belépés, több szállítási cím és több kapcsolattartó tartozhat." />
      {canWrite ? <NewPartnerForm /> : null}
      <div className="table-wrap section-gap"><table><thead><tr><th>Partner</th><th>Kapcsolat</th><th>Fizetés</th><th>Minimum</th><th>Hitelkeret</th><th>Lejárt kezelés</th><th>Utolsó rendelés</th><th>Forgalom</th><th>Követelés</th><th>Állapot</th></tr></thead><tbody>
        {partners.map(p => <tr key={p.id}><td><strong>{p.name}</strong></td><td>{p.email ?? "—"}<div>{p.phone ?? ""}</div></td><td>{p.default_payment_method ?? "—"} · {p.payment_terms_days} nap</td><td>{p.minimum_order_cartons} karton</td><td>{money(p.credit_limit_huf)}</td><td>{p.overdue_policy === "block" ? "Blokkolás" : "Figyelmeztetés"}</td><td>{dateHU(p.last_order_at)}</td><td>{money(p.total_revenue)}</td><td>{money(p.outstanding)}</td><td><StatusBadge value={p.active ? "active" : "cancelled"} label={p.active ? "Aktív" : "Inaktív"} /></td></tr>)}
      </tbody></table></div>
    </div>
  );
}
