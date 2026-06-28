import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { dateHU } from "@/lib/format";
import { requireAppUser } from "@/lib/auth";
import { InventoryAdjustmentForm } from "./InventoryAdjustmentForm";
import { InventorySettingsForm } from "./InventorySettingsForm";
import Link from "next/link";

const lotStatusLabels: Record<string, string> = {
  active: "Aktív",
  depleted: "Elfogyott",
  recalled: "Visszahívott / selejt",
  scrapped: "Selejt",
  expired: "Lejárt",
  void: "Sztornózott",
};

const stockSignalLabels: Record<string, string> = {
  stock_critical: "Kritikus",
  stock_low: "Alacsony",
  stock_medium: "Közepes",
  stock_high: "Magas",
  stock_overstock: "Túlteljesített",
};

function stockSignal(available: number, minimum: number, settings: any) {
  if (available < minimum) return "stock_critical";
  const surplus = available - minimum;
  if (surplus >= Number(settings.overstock_surplus_units)) return "stock_overstock";
  if (surplus >= Number(settings.high_surplus_units)) return "stock_high";
  if (surplus >= Number(settings.medium_surplus_units)) return "stock_medium";
  return "stock_low";
}

export default async function InventoryPage() {
  const user = await requireAppUser(["admin", "management", "staff", "production", "warehouse"]);
  const canAdjust = ["admin", "management", "warehouse"].includes(user.role);

  const settingsRows = await query<any>(`
    select low_surplus_units,medium_surplus_units,high_surplus_units,overstock_surplus_units
      from public.inventory_stock_settings
     where organization_id=$1
  `, [user.organization_id]);
  const settings = settingsRows[0] ?? {
    low_surplus_units: 200,
    medium_surplus_units: 500,
    high_surplus_units: 1000,
    overstock_surplus_units: 2000
  };

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
           coalesce(v.available_units,0)::int as available_units,
           coalesce(c.carton_count,0)::int as carton_count,
           coalesce(c.available_carton_count,0)::int as available_carton_count,
           coalesce(c.allocated_carton_count,0)::int as allocated_carton_count
      from public.lots l
      join public.products p on p.flavor_code = l.flavor_code and p.size_ml = l.size_ml
      left join public.v_lot_stock_summary v on v.lot_id = l.id
      left join public.v_lot_carton_summary c on c.lot_id = l.id
     where l.status in ('active','depleted')
        or (l.status in ('recalled','scrapped','expired') and coalesce(v.physical_units,0) <> 0)
     order by l.best_before, l.id
     limit 250
  `);
  const correctionLots = canAdjust ? await query<any>(`
    select l.id,l.lot_number,p.name as product_name,coalesce(v.physical_units,0)::int as physical_units
      from public.lots l
      join public.products p on p.flavor_code=l.flavor_code and p.size_ml=l.size_ml
      left join public.v_lot_stock_summary v on v.lot_id=l.id
     where l.status='active'
     order by l.best_before,l.id
  `) : [];
  const locations = canAdjust ? await query<any>(`select id,name from public.inventory_locations where active order by name`) : [];

  return (
    <div className="page">
      <PageHeader
        title="Készletlista"
        description="Termékszintű és LOT-szintű szabad készlet. A kézi korrekció indoklással, auditálható készletmozgásként történik."
        actions={
          <>
            <Link href="/internal/inventory/cartons/scanner-test" className="button">Scanner teszt</Link>
            <Link href="/internal/inventory/cartons/check" className="button button-secondary">Karton ellenőrzés</Link>
            <Link href="/internal/inventory/cartons/move" className="button button-primary">Karton áthelyezés</Link>
          </>
        }
      />
      {canAdjust ? <InventoryAdjustmentForm lots={correctionLots} locations={locations} /> : null}
      {canAdjust ? <InventorySettingsForm settings={settings} /> : null}

      <section>
        <h2>Termékkészlet</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Termék</th><th>Méret</th><th>Fizikai</th><th>Foglalt</th><th>Szabad</th><th>Egész karton</th><th>Bontott db</th><th>Minimum</th><th>Jelzés</th></tr></thead>
            <tbody>{products.map(p => {
              const cartons = Math.floor(p.available_units / p.units_per_carton);
              const loose = p.available_units % p.units_per_carton;
              const signal = stockSignal(Number(p.available_units), Number(p.minimum_stock_units), settings);
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
                  <td><StatusBadge value={signal} label={stockSignalLabels[signal]} /></td>
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
            <thead><tr><th>LOT</th><th>Termék</th><th>Lejárat</th><th>Karton</th><th>Fizikai</th><th>Foglalt</th><th>Szabad</th><th>Állapot</th></tr></thead>
            <tbody>{lots.map(l => (
              <tr key={l.id}>
                <td className="mono">{l.lot_number}</td>
                <td>{l.product_name}<div className="mono text-muted">{l.product_code} · {l.size_ml} ml</div></td>
                <td>{dateHU(l.best_before)}</td>
                <td>{l.carton_count} db<div className="text-muted">{l.available_carton_count} szabad · {l.allocated_carton_count} foglalt</div></td>
                <td>{l.physical_units} db</td>
                <td>{l.allocated_units} db</td>
                <td><strong>{l.available_units} db</strong></td>
                <td><StatusBadge value={l.status} label={lotStatusLabels[l.status] ?? l.status} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
