import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { dateHU } from "@/lib/format";
import { requireAppUser } from "@/lib/auth";
import { ShipmentPlanner } from "./ShipmentPlanner";

export default async function ShipmentsPage() {
  const user = await requireAppUser(["admin", "management", "staff", "warehouse", "sales"]);
  const runs = await query<any>(`
    select sr.*, count(d.id)::int as delivery_count
      from public.shipping_runs sr
      left join public.deliveries d on d.shipping_run_id = sr.id
     where sr.organization_id=$1
       and sr.archived_at is null
     group by sr.id
     order by sr.planned_date desc, sr.id desc
     limit 100
  `, [user.organization_id]);
  const deliveries = await query<any>(`
    select d.*, p.name as partner_name, o.order_number, sr.run_number, sr.driver_name
      from public.deliveries d
      join public.partners p on p.id = d.partner_id
      join public.orders o on o.id = d.order_id
      left join public.shipping_runs sr on sr.id=d.shipping_run_id
     where d.status not in ('delivered','cancelled')
       and d.organization_id=$1
       and d.archived_at is null
       and o.archived_at is null
     order by d.planned_date, d.sequence_no
     limit 100
  `, [user.organization_id]);
  const candidates = await query<any>(`
    select o.id,o.order_number,p.name as partner_name,o.requested_delivery_date,
           o.fulfillment_status,o.total_cartons,sr.run_number
      from public.orders o
      join public.partners p on p.id=o.partner_id
      left join public.deliveries d on d.order_id=o.id and d.status not in ('delivered','cancelled')
      left join public.shipping_runs sr on sr.id=d.shipping_run_id
     where o.organization_id=$1
       and o.archived_at is null
       and o.status in ('approved','partially_approved')
       and o.fulfillment_status in ('reserved','partially_reserved','picking','packed','partially_delivered')
     order by o.requested_delivery_date,o.created_at
     limit 200
  `, [user.organization_id]);
  return (
    <div className="page">
      <PageHeader title="Szállítás" description="A szállítás állapota külön kezelendő a rendelés állapotától. Egy járat több partnerhez mehet." />
      {["admin", "management", "warehouse", "sales"].includes(user.role) ? <ShipmentPlanner candidates={candidates} runs={runs} /> : null}
      <section className="grid grid-2">
        <div>
          <h2>Járatok</h2>
          <div className="table-wrap"><table><thead><tr><th>Járat</th><th>Dátum</th><th>Futár</th><th>Jármű</th><th>Állapot</th><th>Megálló</th></tr></thead><tbody>
            {runs.map(r => <tr key={r.id}><td className="mono">{r.run_number}</td><td>{dateHU(r.planned_date)}</td><td>{r.driver_name ?? "—"}</td><td>{r.vehicle ?? "—"}</td><td><StatusBadge value={r.status} label={r.status} /></td><td>{r.delivery_count}</td></tr>)}
            {!runs.length ? <tr><td colSpan={6}>Még nincs járat.</td></tr> : null}
          </tbody></table></div>
        </div>
        <div>
          <h2>Átadásra váró rendelések</h2>
          <div className="table-wrap"><table><thead><tr><th>Sorrend</th><th>Járat</th><th>Rendelés</th><th>Partner</th><th>Futár</th><th>Nap</th><th>Állapot</th></tr></thead><tbody>
            {deliveries.map(d => <tr key={d.id}><td>{d.sequence_no ?? "—"}</td><td className="mono">{d.run_number ?? "—"}</td><td className="mono">{d.order_number}</td><td>{d.partner_name}</td><td>{d.driver_name ?? "—"}</td><td>{dateHU(d.planned_date)}</td><td><StatusBadge value={d.status} label={d.status} /></td></tr>)}
            {!deliveries.length ? <tr><td colSpan={7}>Nincs nyitott átadás.</td></tr> : null}
          </tbody></table></div>
        </div>
      </section>
    </div>
  );
}
