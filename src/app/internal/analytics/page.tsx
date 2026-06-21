import { PageHeader } from "@/components/PageHeader";
import { query } from "@/lib/db";
import { money } from "@/lib/format";

export default async function AnalyticsPage() {
  const products = await query<any>(`
    select oi.product_name_snapshot, sum(di.delivered_units)::int as units,
           sum(di.gross_amount_huf)::bigint as revenue,
           sum(di.cogs_huf)::bigint as cogs
      from public.delivery_items di
      join public.order_items oi on oi.id=di.order_item_id
      join public.deliveries d on d.id=di.delivery_id and d.status='delivered'
     group by oi.product_name_snapshot
     order by units desc
  `);
  const partners = await query<any>(`
    select p.name,
           (select coalesce(sum(r.gross_amount_huf),0) from public.receivables r where r.partner_id=p.id and r.status<>'void')::bigint as revenue,
           (select coalesce(sum(v.outstanding_huf),0) from public.v_receivables_open v where v.partner_id=p.id)::bigint as outstanding
      from public.partners p
     order by revenue desc
  `);
  return (
    <div className="page">
      <PageHeader title="Elemzések" description="A vezérlőpulton Top 3 lista jelenik meg, itt a teljes termék- és partnerrangsor látható." />
      <section className="grid grid-2">
        <div>
          <h2>Termékek</h2>
          <div className="table-wrap"><table><thead><tr><th>#</th><th>Termék</th><th>Átadott db</th><th>Árbevétel</th><th>ELÁBÉ</th><th>Árrés</th></tr></thead><tbody>
            {products.map((p,i) => <tr key={p.product_name_snapshot}><td>{i+1}</td><td>{p.product_name_snapshot}</td><td>{p.units}</td><td>{money(p.revenue)}</td><td>{money(p.cogs)}</td><td>{money(Number(p.revenue)-Number(p.cogs))}</td></tr>)}
          </tbody></table></div>
        </div>
        <div>
          <h2>Partnerek</h2>
          <div className="table-wrap"><table><thead><tr><th>#</th><th>Partner</th><th>Árbevétel</th><th>Követelés</th></tr></thead><tbody>
            {partners.map((p,i) => <tr key={p.name}><td>{i+1}</td><td>{p.name}</td><td>{money(p.revenue)}</td><td>{money(p.outstanding)}</td></tr>)}
          </tbody></table></div>
        </div>
      </section>
    </div>
  );
}
