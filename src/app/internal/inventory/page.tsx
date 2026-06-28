import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { dateHU, dateTimeHU } from "@/lib/format";
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

const movementLabels: Record<string, string> = {
  correction: "Korrekció",
  sample: "Partneri minta",
  marketing: "Marketing / fotózás",
  tasting: "Kóstoltatás",
  internal_use: "Belső felhasználás",
  damage: "Sérülés",
  scrap: "Selejt",
  production: "Gyártás",
  sale: "Értékesítés",
  transfer_out: "Áthelyezés ki",
  transfer_in: "Áthelyezés be",
  recall: "Visszahívás"
};

function stockSignal(available: number, minimum: number, settings: any) {
  if (available < minimum) return "stock_critical";
  const surplus = available - minimum;
  if (surplus >= Number(settings.overstock_surplus_units)) return "stock_overstock";
  if (surplus >= Number(settings.high_surplus_units)) return "stock_high";
  if (surplus >= Number(settings.medium_surplus_units)) return "stock_medium";
  return "stock_low";
}

type SearchParams = Record<string, string | string[] | undefined>;

function paramValue(params: SearchParams, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : "";
}

function dateParam(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

export default async function InventoryPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const user = await requireAppUser(["admin", "management", "staff", "production", "warehouse"]);
  const canAdjust = ["admin", "management", "warehouse"].includes(user.role);
  const params = (await searchParams) ?? {};
  const movementType = paramValue(params, "movementType");
  const productId = paramValue(params, "productId");
  const dateFrom = dateParam(paramValue(params, "dateFrom"));
  const dateTo = dateParam(paramValue(params, "dateTo"));

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
     where l.archived_at is null
       and (
         l.status in ('active','depleted')
         or (l.status in ('recalled','scrapped','expired') and coalesce(v.physical_units,0) <> 0)
       )
     order by l.best_before, l.id
     limit 250
  `);
  const correctionLots = canAdjust ? await query<any>(`
    select l.id,l.lot_number,p.name as product_name,coalesce(v.physical_units,0)::int as physical_units,
           coalesce((
             select jsonb_object_agg(location_id, balance)
               from (
                 select im.location_id,coalesce(sum(im.quantity_units),0)::int as balance
                   from public.inventory_movements im
                  where im.lot_id=l.id and im.archived_at is null
                  group by im.location_id
                 having coalesce(sum(im.quantity_units),0) <> 0
               ) balances
           ),'{}'::jsonb) as location_balances
      from public.lots l
      join public.products p on p.flavor_code=l.flavor_code and p.size_ml=l.size_ml
      left join public.v_lot_stock_summary v on v.lot_id=l.id
     where l.status='active'
       and l.archived_at is null
     order by l.best_before,l.id
  `) : [];
  const locations = canAdjust ? await query<any>(`select id,name from public.inventory_locations where active order by name`) : [];
  const movementValues: unknown[] = [user.organization_id];
  const movementWhere = ["im.organization_id=$1", "im.archived_at is null"];

  if (movementType && movementLabels[movementType]) {
    movementValues.push(movementType);
    movementWhere.push(`im.movement_type=$${movementValues.length}`);
  }
  if (productId && Number.isInteger(Number(productId)) && Number(productId) > 0) {
    movementValues.push(Number(productId));
    movementWhere.push(`im.product_id=$${movementValues.length}`);
  }
  if (dateFrom) {
    movementValues.push(dateFrom);
    movementWhere.push(`im.created_at >= $${movementValues.length}::date`);
  }
  if (dateTo) {
    movementValues.push(dateTo);
    movementWhere.push(`im.created_at < ($${movementValues.length}::date + interval '1 day')`);
  }

  const recentMovements = await query<any>(`
    select im.id,im.movement_type,im.quantity_units,im.reason,im.created_at,
           l.lot_number,p.name as product_name,p.code as product_code,
           loc.name as location_name,
           au.display_name as created_by_name
      from public.inventory_movements im
      join public.lots l on l.id=im.lot_id
      join public.products p on p.id=im.product_id
      left join public.inventory_locations loc on loc.id=im.location_id
      left join public.app_users au on au.user_id=im.created_by
     where ${movementWhere.join(" and ")}
     order by im.created_at desc,im.id desc
     limit 100
  `, movementValues);

  return (
    <div className="page">
      <PageHeader
        title="Készletlista"
        description="Termékszintű és LOT-szintű szabad készlet. A kézi korrekció indoklással, auditálható készletmozgásként történik."
        actions={
          <>
            <Link href="/internal/inventory/cartons" className="button">Karton dashboard</Link>
            <Link href="/internal/inventory/cartons/scanner-test" className="button">Scanner teszt</Link>
            <Link href="/internal/inventory/cartons/check" className="button button-secondary">Karton ellenőrzés</Link>
            <Link href="/internal/inventory/cartons/move" className="button button-primary">Karton áthelyezés</Link>
          </>
        }
      />
      {canAdjust ? <InventoryAdjustmentForm lots={correctionLots} locations={locations} /> : null}
      {canAdjust ? <InventorySettingsForm settings={settings} /> : null}

      <section className="section-gap">
        <h2>Legutóbbi készletmozgások</h2>
        <form className="filter-bar section-gap-small" action="/internal/inventory">
          <label>Típus<select name="movementType" defaultValue={movementType}>
            <option value="">Minden</option>
            {Object.entries(movementLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select></label>
          <label>Termék<select name="productId" defaultValue={productId}>
            <option value="">Minden</option>
            {products.map((product) => <option key={product.product_id} value={product.product_id}>{product.product_name} · {product.size_ml} ml</option>)}
          </select></label>
          <label>Dátumtól<input name="dateFrom" type="date" defaultValue={dateFrom} /></label>
          <label>Dátumig<input name="dateTo" type="date" defaultValue={dateTo} /></label>
          <button className="button button-primary filter-actions">Szűrés</button>
          <Link className="button filter-actions" href="/internal/inventory">Alaphelyzet</Link>
        </form>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Időpont</th><th>LOT</th><th>Termék</th><th>Hely</th><th>Típus</th><th>Darab</th><th>Indok</th><th>Rögzítette</th></tr></thead>
            <tbody>{recentMovements.map((movement) => (
              <tr key={movement.id}>
                <td>{dateTimeHU(movement.created_at)}</td>
                <td className="mono">{movement.lot_number}</td>
                <td>{movement.product_name}<div className="mono text-muted">{movement.product_code}</div></td>
                <td>{movement.location_name ?? "—"}</td>
                <td>{movementLabels[movement.movement_type] ?? movement.movement_type}</td>
                <td className={Number(movement.quantity_units) < 0 ? "text-danger" : "text-success"}>{Number(movement.quantity_units) > 0 ? "+" : ""}{movement.quantity_units} db</td>
                <td>{movement.reason ?? "—"}</td>
                <td>{movement.created_by_name ?? "Rendszer"}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {!recentMovements.length ? <div className="empty-state section-gap-small">Nincs a szűrésnek megfelelő készletmozgás.</div> : null}
      </section>

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
