import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { requireAppUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { dateHU, dateTimeHU } from "@/lib/format";

const statusLabels: Record<string, string> = {
  created: "Létrehozva",
  in_stock: "Készleten",
  reserved: "Foglalt",
  picked: "Összekészítve",
  delivered: "Átadva",
  returned: "Visszáru",
  recalled: "Visszahívott",
  scrapped: "Selejt",
  archived: "Archivált"
};

type SearchParams = {
  status?: string;
  q?: string;
};

export default async function CartonsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAppUser(["admin", "management", "staff", "production", "warehouse"]);
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "";
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const values: unknown[] = [];
  const where = ["c.archived_at is null"];

  if (status) {
    values.push(status);
    where.push(`c.status=$${values.length}`);
  }
  if (q) {
    values.push(`%${q}%`);
    where.push(`(c.carton_code ilike $${values.length} or p.name ilike $${values.length} or l.lot_number ilike $${values.length} or o.order_number ilike $${values.length})`);
  }

  const summary = await query<any>(`
    select c.status,count(*)::int as count,coalesce(sum(c.quantity_units),0)::int as units
      from public.inventory_cartons c
     where c.archived_at is null
     group by c.status
     order by c.status
  `);

  const cartons = await query<any>(`
    select c.id,c.carton_code,c.quantity_units,c.status,c.created_at,c.updated_at,
           p.name as product_name,p.code as product_code,p.size_ml,
           l.id as lot_id,l.lot_number,l.best_before,
           loc.name as location_name,loc.code as location_code,
           a.id as allocation_id,a.status as allocation_status,
           o.id as order_id,o.order_number,
           e.event_type as last_event_type,e.created_at as last_event_at
      from public.inventory_cartons c
      join public.products p on p.id=c.product_id
      join public.lots l on l.id=c.lot_id
      left join public.inventory_locations loc on loc.id=c.location_id
      left join public.order_item_lot_allocations a on a.carton_id=c.id and a.status in ('allocated','picked')
      left join public.order_items oi on oi.id=a.order_item_id
      left join public.orders o on o.id=oi.order_id
      left join lateral (
        select event_type,created_at
          from public.inventory_carton_events e
         where e.carton_id=c.id
         order by e.created_at desc,e.id desc
         limit 1
      ) e on true
     where ${where.join(" and ")}
     order by c.updated_at desc,c.id desc
     limit 300
  `, values);

  return (
    <div className="page">
      <PageHeader
        title="Karton dashboard"
        description="Fizikai kartonok állapota, raktárhelye, LOT-ja és rendeléshez kötése."
        actions={
          <>
            <Link className="button" href="/internal/inventory/cartons/scanner-test">Scanner teszt</Link>
            <Link className="button button-secondary" href="/internal/inventory/cartons/check">Karton ellenőrzés</Link>
            <Link className="button button-primary" href="/internal/inventory/cartons/move">Karton áthelyezés</Link>
          </>
        }
      />

      <section className="grid grid-4">
        {summary.map((row) => (
          <Link className="card metric" href={`/internal/inventory/cartons?status=${row.status}`} key={row.status}>
            <div className="metric-label">{statusLabels[row.status] ?? row.status}</div>
            <div className="metric-value">{row.count}</div>
            <div className="metric-note">{row.units} db</div>
          </Link>
        ))}
      </section>

      <form className="filter-bar section-gap">
        <label>Keresés<input name="q" defaultValue={q} placeholder="Karton, LOT, termék, rendelés" /></label>
        <label>Állapot<select name="status" defaultValue={status}>
          <option value="">Minden</option>
          {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select></label>
        <button className="button button-primary filter-actions">Szűrés</button>
        <Link className="button filter-actions" href="/internal/inventory/cartons">Alaphelyzet</Link>
      </form>

      <section className="section-gap">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Karton</th><th>Termék</th><th>LOT</th><th>Hely</th><th>Mennyiség</th><th>Állapot</th><th>Rendelés</th><th>Utolsó esemény</th></tr></thead>
            <tbody>
              {cartons.map((carton) => (
                <tr key={carton.id}>
                  <td className="mono">{carton.carton_code}</td>
                  <td>{carton.product_name}<div className="text-muted mono">{carton.product_code} · {carton.size_ml} ml</div></td>
                  <td><Link className="mono" href={`/internal/inventory/cartons/labels/${carton.lot_id}`}>{carton.lot_number}</Link><div className="text-muted">{dateHU(carton.best_before)}</div></td>
                  <td>{carton.location_name ?? "—"}<div className="text-muted mono">{carton.location_code ?? ""}</div></td>
                  <td>{carton.quantity_units} db</td>
                  <td><StatusBadge value={carton.status} label={statusLabels[carton.status] ?? carton.status} /></td>
                  <td>{carton.order_id ? <Link className="mono" href={`/internal/orders/${carton.order_id}`}>{carton.order_number}</Link> : <span className="text-muted">—</span>}<div className="text-muted">{carton.allocation_status ?? ""}</div></td>
                  <td>{carton.last_event_type ?? "—"}<div className="text-muted">{dateTimeHU(carton.last_event_at)}</div></td>
                </tr>
              ))}
              {!cartons.length ? <tr><td colSpan={8}>Nincs a szűrésnek megfelelő karton.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
