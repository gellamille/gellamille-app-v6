import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { dateHU } from "@/lib/format";
import { requireAppUser } from "@/lib/auth";
import { huLabel, lotStatusLabels } from "@/lib/status";

export default async function ProductionPage() {
  const user = await requireAppUser(["admin", "management", "staff", "production"]);

  const lots = await query<any>(`
    select l.id, l.lot_number, l.flavor_code, l.size_ml, l.production_date,
           l.production_period, l.best_before, l.quantity, l.operator_name, l.status,
           coalesce(v.physical_units,0)::int as physical_units,
           coalesce(v.allocated_units,0)::int as allocated_units,
           coalesce(v.available_units,0)::int as available_units,
           coalesce(c.carton_count,0)::int as carton_count,
           coalesce(c.available_carton_count,0)::int as available_carton_count,
           coalesce(c.allocated_carton_count,0)::int as allocated_carton_count
      from public.lots l
      left join public.v_lot_stock_summary v on v.lot_id = l.id
      left join public.v_lot_carton_summary c on c.lot_id = l.id
     where l.organization_id=$1 and l.archived_at is null
     order by l.production_date desc, l.id desc
     limit 250
  `, [user.organization_id]);

  return (
    <div className="page">
      <PageHeader
        title="Gyártás és LOT"
        description="A gyártás rendelésektől függetlenül növeli az eladható készletet. A LOT mennyisége közvetlenül nem írható át."
        actions={<Link href="/internal/production/new" className="button button-primary">Új LOT létrehozása</Link>}
      />
      <div className="table-wrap">
        <table>
          <thead><tr><th>LOT</th><th>Termék</th><th>Gyártás</th><th>Lejárat</th><th>Felelős</th><th>Gyártott</th><th>Karton</th><th>Fizikai</th><th>Foglalt</th><th>Szabad</th><th>Állapot</th><th>Művelet</th></tr></thead>
          <tbody>
            {lots.map(l => (
              <tr key={l.id}>
                <td className="mono">{l.lot_number}</td>
                <td>{l.flavor_code} · {l.size_ml} ml</td>
                <td>{dateHU(l.production_date)} {l.production_period}</td>
                <td>{dateHU(l.best_before)}</td>
                <td>{l.operator_name}</td>
                <td>{l.quantity} db</td>
                <td>{l.carton_count} db<div className="text-muted">{l.available_carton_count} szabad · {l.allocated_carton_count} foglalt</div></td>
                <td>{l.physical_units} db</td>
                <td>{l.allocated_units} db</td>
                <td><strong>{l.available_units} db</strong></td>
                <td><StatusBadge value={l.status} label={huLabel(lotStatusLabels, l.status)} /></td>
                <td><Link className="button button-small" href={`/internal/inventory/cartons/labels/${l.id}`}>{l.carton_count > 0 ? "Címkék" : "Kartonozás"}</Link></td>
              </tr>
            ))}
            {!lots.length ? <tr><td colSpan={12}>Még nincs LOT.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
