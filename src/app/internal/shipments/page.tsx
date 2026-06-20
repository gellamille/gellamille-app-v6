import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { dateHU } from "@/lib/format";

export default async function ShipmentsPage() {
  const runs = await query<any>(`
    select sr.*, count(d.id)::int as delivery_count
      from public.shipping_runs sr
      left join public.deliveries d on d.shipping_run_id = sr.id
     group by sr.id
     order by sr.planned_date desc, sr.id desc
     limit 100
  `);
  const deliveries = await query<any>(`
    select d.*, p.name as partner_name, o.order_number
      from public.deliveries d
      join public.partners p on p.id = d.partner_id
      join public.orders o on o.id = d.order_id
     where d.status not in ('delivered','cancelled')
     order by d.planned_date, d.sequence_no
     limit 100
  `);
  return (
    <div className="page">
      <PageHeader title="Szállítás" description="A szállítás állapota külön kezelendő a rendelés állapotától. Egy járat több partnerhez mehet." />
      <section className="grid grid-2">
        <div>
          <h2>Járatok</h2>
          <div className="table-wrap"><table><thead><tr><th>Járat</th><th>Dátum</th><th>Állapot</th><th>Megálló</th></tr></thead><tbody>
            {runs.map(r => <tr key={r.id}><td className="mono">{r.run_number}</td><td>{dateHU(r.planned_date)}</td><td><StatusBadge value={r.status} label={r.status} /></td><td>{r.delivery_count}</td></tr>)}
            {!runs.length ? <tr><td colSpan={4}>Még nincs járat.</td></tr> : null}
          </tbody></table></div>
        </div>
        <div>
          <h2>Átadásra váró rendelések</h2>
          <div className="table-wrap"><table><thead><tr><th>Sorrend</th><th>Rendelés</th><th>Partner</th><th>Nap</th><th>Állapot</th></tr></thead><tbody>
            {deliveries.map(d => <tr key={d.id}><td>{d.sequence_no ?? "—"}</td><td className="mono">{d.order_number}</td><td>{d.partner_name}</td><td>{dateHU(d.planned_date)}</td><td><StatusBadge value={d.status} label={d.status} /></td></tr>)}
            {!deliveries.length ? <tr><td colSpan={5}>Nincs nyitott átadás.</td></tr> : null}
          </tbody></table></div>
        </div>
      </section>
    </div>
  );
}
