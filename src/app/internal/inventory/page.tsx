import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { dateHU } from "@/lib/format";
import { requireAppUser } from "@/lib/auth";

export default async function InventoryPage() {
  await requireAppUser(["admin", "management", "staff", "production", "warehouse"]);

  const products = await query<any>(`
    select *
      from public.v_product_stock_summary
     order by size_ml, sort_order, product_code
  `);

  const lots = await query<any>(`
    select l.id, l.lot_number, l.best_before, l.status,
           p.name as product_name, p.code as product_code, p.size_ml,
           coalesce(v.physical_units,0)::int as physical_units,
           coalesce(v.allocated_units,0)::int as allocated_units,
           coalesce(v.available_units,0)::int as available_units
      from public.lots l
      join public.products p on p.flavor_code = l.flavor_code and p.size_ml = l.size_ml
      left join public.v_lot_stock_summary v on v.lot_id = l.id
     where l.status in ('active','depleted')
     order by l.best_before, l.id
     limit 250
  `);

  return (
    <div className="page">
      <PageHeader
        title="Készletlista"
        description="V7.1 MVP: termékszintű és LOT-szintű szabad készlet. Korrekció, leltár és visszáru nincs kitéve a felületen."
      />

      <section>
        <h2>Termékkészlet</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Termék</th><th>Méret</th><th>Fizikai</th><th>Foglalt</th><th>Szabad</th><th>Egész karton</th><th>Bontott db</th><th>Minimum</th><th>Jelzés</th></tr></thead>
            <tbody>{products.map(p => {
              const cartons = Math.floor(p.available_units / p.units_per_carton);
              const loose = p.available_units % p.units_per_carton;
              const low = p.available_units < p.minimum_stock_units;
              return (
                <tr key={p.product_id}>
                  <td>{p.product_name}<div className="mono text-muted">{p.product_code}</div></td>
                  <td>{p.size_ml} ml</td>
                  <td>{p.physical_units} db</td>
                  <td>{p.reserved_units} db</td>
                  <td><strong>{p.available_units} db</strong></td>
                  <td>{cartons}</td>
                  <td>{loose}</td>
                  <td>{p.minimum_stock_units} db</td>
                  <td>{low ? <StatusBadge value="stock_shortage" label="Alacsony" /> : <StatusBadge value="available" label="Rendben" />}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </section>

      <section className="section-gap">
        <h2>LOT készlet</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>LOT</th><th>Termék</th><th>Lejárat</th><th>Fizikai</th><th>Foglalt</th><th>Szabad</th><th>Állapot</th></tr></thead>
            <tbody>{lots.map(l => (
              <tr key={l.id}>
                <td className="mono">{l.lot_number}</td>
                <td>{l.product_name}<div className="mono text-muted">{l.product_code} · {l.size_ml} ml</div></td>
                <td>{dateHU(l.best_before)}</td>
                <td>{l.physical_units} db</td>
                <td>{l.allocated_units} db</td>
                <td><strong>{l.available_units} db</strong></td>
                <td><StatusBadge value={l.status} label={l.status === "active" ? "Aktív" : "Elfogyott"} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
