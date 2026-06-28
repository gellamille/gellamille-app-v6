import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { requireAppUser } from "@/lib/auth";
import { one, query } from "@/lib/db";
import { dateHU, dateTimeHU } from "@/lib/format";

const statusLabels: Record<string, string> = {
  created: "Létrehozva",
  in_stock: "Készleten",
  reserved: "Foglalva",
  picked: "Összekészítve",
  delivered: "Átadva",
  returned: "Visszavéve",
  recalled: "Visszahívott",
  scrapped: "Selejt",
  archived: "Archivált"
};

const eventLabels: Record<string, string> = {
  created: "Létrehozva",
  received: "Bevételezve",
  moved: "Áthelyezve",
  reserved: "Foglalva",
  picked: "Összekészítve",
  unpicked: "Összekészítés visszavonva",
  delivered: "Átadva",
  returned: "Visszavéve",
  scrapped: "Selejtezve",
  recalled: "Visszahívva",
  archived: "Archiválva",
  label_printed: "Címke nyomtatva",
  label_reprinted: "Címke újranyomtatva",
  checked: "Ellenőrizve"
};

function eventDataText(value: unknown) {
  if (!value || (typeof value === "object" && !Array.isArray(value) && !Object.keys(value).length)) return "";
  return JSON.stringify(value, null, 2);
}

export default async function CartonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAppUser(["admin", "management", "staff", "production", "warehouse"]);
  const { id } = await params;

  const carton = await one<any>(`
    select c.id,c.carton_code,c.quantity_units,c.status,c.created_at,c.updated_at,
           p.name as product_name,p.code as product_code,p.size_ml,p.units_per_carton,
           l.id as lot_id,l.lot_number,l.production_date,l.best_before,l.status as lot_status,
           loc.name as location_name,loc.code as location_code,loc.type as location_type,
           a.id as allocation_id,a.quantity_units as allocation_units,a.status as allocation_status,a.delivered_at as allocation_delivered_at,
           oi.id as order_item_id,oi.product_name_snapshot,
           o.id as order_id,o.order_number,o.status as order_status,o.fulfillment_status
      from public.inventory_cartons c
      join public.products p on p.id=c.product_id
      join public.lots l on l.id=c.lot_id
      left join public.inventory_locations loc on loc.id=c.location_id
      left join public.order_item_lot_allocations a on a.carton_id=c.id and a.status in ('allocated','picked','delivered')
      left join public.order_items oi on oi.id=a.order_item_id
      left join public.orders o on o.id=oi.order_id
     where c.id=$1 and c.organization_id=$2 and c.archived_at is null
     limit 1
  `, [id, user.organization_id]);

  if (!carton) notFound();

  const events = await query<any>(`
    select e.id,e.event_type,e.note,e.event_data,e.created_at,
           from_loc.name as from_location_name,
           to_loc.name as to_location_name,
           au.display_name as actor_name,
           o.id as order_id,o.order_number,
           oi.product_name_snapshot
      from public.inventory_carton_events e
      left join public.inventory_locations from_loc on from_loc.id=e.from_location_id
      left join public.inventory_locations to_loc on to_loc.id=e.to_location_id
      left join public.app_users au on au.user_id=e.actor_user_id
      left join public.orders o on o.id=e.order_id
      left join public.order_items oi on oi.id=e.order_item_id
     where e.organization_id=$1 and e.carton_id=$2
     order by e.created_at desc,e.id desc
     limit 100
  `, [user.organization_id, carton.id]);

  return (
    <div className="page">
      <PageHeader
        title={carton.carton_code}
        description={`${carton.product_name} · LOT ${carton.lot_number}`}
        actions={
          <>
            <Link className="button" href="/internal/inventory/cartons">Dashboard</Link>
            <Link className="button button-secondary" href="/internal/inventory/cartons/check">Karton ellenőrzés</Link>
            <Link className="button button-primary" href="/internal/inventory/cartons/move">Karton áthelyezés</Link>
          </>
        }
      />

      <section className="grid grid-3">
        <article className="card">
          <h3>Állapot</h3>
          <StatusBadge value={carton.status} label={statusLabels[carton.status] ?? carton.status} />
          <dl className="kv section-gap-small">
            <dt>Mennyiség</dt><dd>{carton.quantity_units} db</dd>
            <dt>Létrehozva</dt><dd>{dateTimeHU(carton.created_at)}</dd>
            <dt>Frissítve</dt><dd>{dateTimeHU(carton.updated_at)}</dd>
          </dl>
        </article>

        <article className="card">
          <h3>Termék és LOT</h3>
          <dl className="kv">
            <dt>Termék</dt><dd>{carton.product_name}</dd>
            <dt>SKU</dt><dd className="mono">{carton.product_code}</dd>
            <dt>Kiszerelés</dt><dd>{carton.size_ml} ml</dd>
            <dt>LOT</dt><dd><Link className="mono" href={`/internal/inventory/cartons/labels/${carton.lot_id}`}>{carton.lot_number}</Link></dd>
            <dt>Gyártás</dt><dd>{dateHU(carton.production_date)}</dd>
            <dt>Lejárat</dt><dd>{dateHU(carton.best_before)}</dd>
          </dl>
        </article>

        <article className="card">
          <h3>Hely és rendelés</h3>
          <dl className="kv">
            <dt>Raktárhely</dt><dd>{carton.location_name ?? "Nincs hely"}</dd>
            <dt>Hely kód</dt><dd className="mono">{carton.location_code ?? "—"}</dd>
            <dt>Rendelés</dt><dd>{carton.order_id ? <Link className="mono" href={`/internal/orders/${carton.order_id}`}>{carton.order_number}</Link> : "—"}</dd>
            <dt>Kapcsolat</dt><dd>{carton.allocation_status ?? "—"}</dd>
            <dt>Átadás</dt><dd>{dateTimeHU(carton.allocation_delivered_at)}</dd>
          </dl>
        </article>
      </section>

      <section className="card section-gap">
        <h2>Eseménynapló</h2>
        <div className="event-list">
          {events.map((event) => {
            const dataText = eventDataText(event.event_data);
            return (
              <div className="event-row" key={event.id}>
                <div>
                  <strong>{eventLabels[event.event_type] ?? event.event_type}</strong>
                  {event.order_number ? <div><Link className="mono text-muted" href={`/internal/orders/${event.order_id}`}>{event.order_number}</Link></div> : null}
                  {event.product_name_snapshot ? <div className="text-muted">{event.product_name_snapshot}</div> : null}
                  {event.from_location_name || event.to_location_name ? (
                    <div className="text-muted">{event.from_location_name ?? "-"} - {event.to_location_name ?? "-"}</div>
                  ) : null}
                  {event.note ? <div className="text-muted">{event.note}</div> : null}
                  {dataText ? <pre className="text-muted mono">{dataText}</pre> : null}
                </div>
                <div className="event-meta">
                  <strong>{event.actor_name ?? "Rendszer"}</strong>
                  <span>{dateTimeHU(event.created_at)}</span>
                </div>
              </div>
            );
          })}
          {!events.length ? <div className="empty-inline">Nincs esemény ehhez a kartonhoz.</div> : null}
        </div>
      </section>
    </div>
  );
}
