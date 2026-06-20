import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { requireAppUser } from "@/lib/auth";
import { one, query } from "@/lib/db";
import { dateHU, money } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { orderStatusLabels } from "@/lib/status";

export default async function PartnerDashboardPage() {
  const user = await requireAppUser(["partner"]);
  const partner = await one<any>(`
    select p.*, coalesce(sum(v.outstanding_huf),0)::bigint as outstanding
      from public.partners p
      left join public.v_receivables_open v on v.partner_id=p.id
     where p.id=$1 group by p.id
  `, [user.partner_id]);
  const orders = await query<any>(`
    select id, order_number, requested_delivery_date, status, gross_total_huf
      from public.orders where partner_id=$1 order by created_at desc limit 5
  `, [user.partner_id]);

  return (
    <div>
      <PageHeader title={partner?.name ?? "Partneri felület"} description="Rendelés kartonban, a jóváhagyott szállítási napokra." actions={<Link href="/partner/catalog" className="button button-primary">Új rendelés</Link>} />
      <section className="grid grid-3">
        <div className="card metric"><div className="metric-label">Nyitott követelés</div><div className="metric-value">{money(partner?.outstanding)}</div></div>
        <div className="card metric"><div className="metric-label">Minimum rendelés</div><div className="metric-value">{partner?.minimum_order_cartons ?? 5} karton</div></div>
        <div className="card metric"><div className="metric-label">Fizetési határidő</div><div className="metric-value">{partner?.payment_terms_days ?? 0} nap</div></div>
      </section>
      <section className="section-gap">
        <div className="card-title-row"><h2>Legutóbbi rendelések</h2><Link href="/partner/orders" className="button button-small">Összes</Link></div>
        <div className="table-wrap"><table><thead><tr><th>Rendelés</th><th>Szállítás</th><th>Állapot</th><th>Bruttó</th></tr></thead><tbody>
          {orders.map(o => <tr key={o.id}><td className="mono">{o.order_number}</td><td>{dateHU(o.requested_delivery_date)}</td><td><StatusBadge value={o.status} label={orderStatusLabels[o.status] ?? o.status} /></td><td>{money(o.gross_total_huf)}</td></tr>)}
          {!orders.length ? <tr><td colSpan={4}>Még nincs rendelés.</td></tr> : null}
        </tbody></table></div>
      </section>
    </div>
  );
}
