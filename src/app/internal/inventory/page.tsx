import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { InventoryAdjustmentForm } from "./InventoryAdjustmentForm";
import { currentAppUser } from "@/lib/auth";

export default async function InventoryPage() {
  const user = await currentAppUser();
  const canAdjust = !!user && ["admin","management","warehouse"].includes(user.role);
  const products = await query<any>(`
    select * from public.v_product_stock_summary
    order by size_ml, sort_order, product_code
  `);
  const locations = await query<any>(`select id, code, name, type, active from public.inventory_locations order by id`);
  const activeLots = await query<any>(`
    select l.id,l.lot_number,p.name as product_name,coalesce(v.physical_units,0)::int physical_units
      from public.lots l join public.products p on p.flavor_code=l.flavor_code and p.size_ml=l.size_ml
      left join public.v_lot_stock_summary v on v.lot_id=l.id
     where l.status='active' order by l.best_before,l.id
  `);
  const recent = await query<any>(`
    select im.id, im.created_at, im.movement_type, im.quantity_units, im.reason,
           p.name as product_name, p.size_ml, l.lot_number, loc.name as location_name
      from public.inventory_movements im
      join public.products p on p.id = im.product_id
      left join public.lots l on l.id = im.lot_id
      join public.inventory_locations loc on loc.id = im.location_id
     order by im.created_at desc
     limit 40
  `);

  return (
    <div className="page">
      <PageHeader title="Készlet" description="Fizikai, foglalt és szabad készlet darabban. Partnernek csak egész karton adható ki." />
      <section className="grid grid-3">
        {locations.map(loc => <div className="card" key={loc.id}><div className="metric-label">{loc.type}</div><div className="metric-value" style={{fontSize:22}}>{loc.name}</div><div className="metric-note">{loc.code} · {loc.active ? "aktív" : "inaktív"}</div></div>)}
      </section>

      {canAdjust ? <section className="section-gap"><InventoryAdjustmentForm lots={activeLots} locations={locations.filter(l => l.active).map(l => ({id:l.id,name:l.name}))} /></section> : null}

      <section className="section-gap">
        <h2>Termékkészlet</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Termék</th><th>Méret</th><th>Fizikai</th><th>Foglalt</th><th>Szabad</th><th>Egész karton</th><th>Bontott db</th><th>Minimum</th><th>Jelzés</th></tr></thead>
            <tbody>{products.map(p => {
              const cartons = Math.floor(p.available_units / p.units_per_carton);
              const loose = p.available_units % p.units_per_carton;
              const low = p.available_units < p.minimum_stock_units;
              return <tr key={p.product_id}><td>{p.product_name}<div className="mono text-muted">{p.product_code}</div></td><td>{p.size_ml} ml</td><td>{p.physical_units} db</td><td>{p.reserved_units} db</td><td><strong>{p.available_units} db</strong></td><td>{cartons}</td><td>{loose}</td><td>{p.minimum_stock_units} db</td><td>{low ? <StatusBadge value="stock_shortage" label="Alacsony" /> : <StatusBadge value="available" label="Rendben" />}</td></tr>
            })}</tbody>
          </table>
        </div>
      </section>

      <section className="section-gap">
        <h2>Legutóbbi készletmozgások</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Időpont</th><th>Típus</th><th>Termék</th><th>LOT</th><th>Hely</th><th>Mennyiség</th><th>Indok</th></tr></thead>
            <tbody>{recent.map(m => <tr key={m.id}><td>{new Date(m.created_at).toLocaleString("hu-HU")}</td><td>{m.movement_type}</td><td>{m.product_name} {m.size_ml} ml</td><td className="mono">{m.lot_number ?? "—"}</td><td>{m.location_name}</td><td className={m.quantity_units >= 0 ? "text-success" : "text-danger"}>{m.quantity_units > 0 ? "+" : ""}{m.quantity_units} db</td><td>{m.reason ?? "—"}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
