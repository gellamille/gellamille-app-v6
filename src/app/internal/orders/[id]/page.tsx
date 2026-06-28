import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { one, query } from "@/lib/db";
import { dateHU, dateTimeHU, dateWithWeekdayHU, money } from "@/lib/format";
import { INTERNAL_ROLES, requireAppUser } from "@/lib/auth";
import { financeStatusLabels, fulfillmentLabels, orderStatusLabels } from "@/lib/status";
import { OrderActions } from "./OrderActions";
import { OrderCartonPicker } from "./OrderCartonPicker";
import { UnpickCartonButton } from "./UnpickCartonButton";
import { DeleteOrderButton } from "./DeleteOrderButton";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAppUser(INTERNAL_ROLES);

  const { id } = await params;
  const order = await one<any>(`
    select o.*, p.name as partner_name, p.payment_terms_days,
           pa.name as delivery_address_name,
           concat_ws(', ', pa.postal_code, pa.city, pa.address_line1) as delivery_address
      from public.orders o
      join public.partners p on p.id = o.partner_id
      left join public.partner_addresses pa on pa.id = o.delivery_address_id
     where o.id = $1 and o.archived_at is null
  `, [id]);
  if (!order) notFound();

  const items = await query<any>(`
    select oi.*, p.status as product_status,
           coalesce((
             select sum(a.quantity_units)
               from public.order_item_lot_allocations a
              where a.order_item_id=oi.id and a.status in ('allocated','picked')
           ),0)::int as lot_quantity,
           coalesce((
             select sum(a.quantity_units)
               from public.order_item_lot_allocations a
              where a.order_item_id=oi.id and a.status='picked'
           ),0)::int as picked_quantity
      from public.order_items oi
      join public.products p on p.id = oi.product_id
     where oi.order_id = $1 and oi.unit_quantity > 0
     order by oi.id
  `, [id]);

  const history = await query<any>(`
    select h.*, au.display_name
      from public.order_status_history h
      left join public.app_users au on au.user_id = h.changed_by
     where h.order_id = $1
     order by h.changed_at desc
  `, [id]);

  const receivables = await query<any>(`
    select * from public.v_receivables_open where order_id = $1 order by delivered_at desc
  `, [id]);
  const lotAllocations = await query<any>(`
    select a.id,a.quantity_units,a.status,a.delivered_at,l.lot_number,l.best_before,oi.product_name_snapshot,
           c.carton_code,c.id as carton_id
      from public.order_item_lot_allocations a
      join public.lots l on l.id=a.lot_id
      join public.order_items oi on oi.id=a.order_item_id
      left join public.inventory_cartons c on c.id=a.carton_id
     where oi.order_id=$1
     order by oi.id,l.best_before,l.lot_number
  `, [id]);
  const cartonPickEvents = await query<any>(`
    select e.id,e.event_type,e.note,e.created_at,
           e.event_data->>'quantity_units' as quantity_units,
           c.id as carton_id,c.carton_code,
           l.lot_number,
           oi.product_name_snapshot,
           au.display_name as actor_name
      from public.inventory_carton_events e
      join public.inventory_cartons c on c.id=e.carton_id
      left join public.lots l on l.id=c.lot_id
      left join public.order_items oi on oi.id=e.order_item_id
      left join public.app_users au on au.user_id=e.actor_user_id
     where e.organization_id=$1 and e.order_id=$2 and e.event_type in ('picked','unpicked')
     order by e.created_at desc,e.id desc
     limit 50
  `, [user.organization_id, id]);
  const itemReadiness = items.map((item) => {
    const remaining = Math.max(0, Number(item.unit_quantity ?? 0) - Number(item.cancelled_quantity ?? 0) - Number(item.fulfilled_quantity ?? 0));
    const reserved = Number(item.reserved_quantity ?? 0);
    const picked = Number(item.picked_quantity ?? 0);
    const missingReservation = Math.max(0, remaining - reserved);
    const missingLot = Math.max(0, remaining - picked);
    const issue = missingReservation > 0
      ? `${missingReservation} db hiányzik a foglalásból. Gyártás vagy készletre vétel szükséges.`
      : missingLot > 0
        ? `${missingLot} db hiányzik a LOT-kiosztásból. FEFO összekészítés szükséges.`
        : "";
    return { ...item, remaining, reserved, picked, missingReservation, missingLot, issue };
  });
  const activeItems = itemReadiness.filter((item) => item.remaining > 0);
  const readinessIssues = activeItems.filter((item) => item.issue);
  const hasMissingReservation = activeItems.some((item) => item.missingReservation > 0);
  const canDeliver = activeItems.length > 0 && readinessIssues.length === 0;
  const canScanPick = ["approved", "partially_approved"].includes(order.status) && !["delivered", "cancelled"].includes(order.fulfillment_status);
  const canEditOrder = !["closed", "cancelled", "void"].includes(order.status) && !["delivered", "cancelled"].includes(order.fulfillment_status) && !["receivable", "paid", "partially_paid", "overdue", "void"].includes(order.finance_status);

  return (
    <div className="page">
      <PageHeader
        title={order.order_number}
        description={`${order.partner_name} · Kért szállítás: ${dateWithWeekdayHU(order.requested_delivery_date)}`}
        actions={<><OrderActions orderId={Number(id)} status={order.status} fulfillmentStatus={order.fulfillment_status} canDeliver={canDeliver} hasMissingReservation={hasMissingReservation} />{canEditOrder ? <Link className="button" href={`/internal/orders/${id}/edit`}>Szerkesztés</Link> : null}{canEditOrder ? <DeleteOrderButton orderId={Number(id)} /> : null}<Link className="button button-danger" href={`/internal/recalls?orderId=${id}`}>Visszahívás</Link></>}
      />
      {readinessIssues.length ? (
        <section className="alert alert-warning section-gap">
          <strong>Átadás még nem indítható.</strong>
          <div className="section-gap-small">
            {readinessIssues.map((item) => (
              <div key={item.id}>{item.product_name_snapshot}: {item.issue}</div>
            ))}
          </div>
        </section>
      ) : null}
      <section className="grid grid-3">
        <div className="card">
          <h3>Rendelési állapot</h3>
          <StatusBadge value={order.status} label={orderStatusLabels[order.status] ?? order.status} />
        </div>
        <div className="card">
          <h3>Teljesítés</h3>
          <StatusBadge value={order.fulfillment_status} label={fulfillmentLabels[order.fulfillment_status] ?? order.fulfillment_status} />
        </div>
        <div className="card">
          <h3>Pénzügy</h3>
          <StatusBadge value={order.finance_status} label={financeStatusLabels[order.finance_status] ?? order.finance_status} />
        </div>
      </section>

      <section className="grid grid-2 section-gap">
        <div className="card">
          <h2>Rendelési adatok</h2>
          <dl className="kv">
            <dt>Partner</dt><dd>{order.partner_name}</dd>
            <dt>Kért szállítási nap</dt><dd><strong>{dateWithWeekdayHU(order.requested_delivery_date)}</strong></dd>
            <dt>Szállítási cím</dt><dd>{order.delivery_address ?? "Nincs kiválasztva"}</dd>
            <dt>Fizetési mód</dt><dd>{order.payment_method ?? "—"}</dd>
            <dt>Fizetési határidő</dt><dd>{order.payment_terms_days ?? 0} nap</dd>
            <dt>Megjegyzés</dt><dd>{order.note ?? "—"}</dd>
            <dt>Beküldve</dt><dd>{dateTimeHU(order.submitted_at)}</dd>
          </dl>
        </div>
        <div className="card">
          <h2>Összesítés</h2>
          <dl className="kv">
            <dt>Karton</dt><dd>{order.total_cartons}</dd>
            <dt>Darab</dt><dd>{order.total_units}</dd>
            <dt>Nettó</dt><dd>{money(order.net_total_huf)}</dd>
            <dt>Áfa</dt><dd>{money(order.vat_total_huf)}</dd>
            <dt>Bruttó</dt><dd>{money(order.gross_total_huf)}</dd>
          </dl>
        </div>
      </section>

      <section className="section-gap">
        <OrderCartonPicker orderId={Number(id)} enabled={canScanPick} />
      </section>

      <section className="section-gap">
        <h2>Tételek</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Termék</th><th>Karton</th><th>Rendelt db</th><th>Foglalt</th><th>LOT</th><th>Átadott</th><th>Lemondott</th><th>Nettó/db</th><th>Bruttó</th></tr></thead>
            <tbody>
              {itemReadiness.map((i) => (
                <tr key={i.id}>
                  <td>
                    {i.product_name_snapshot}
                    <div className="text-muted mono">{i.product_code_snapshot}</div>
                    {i.issue ? <div className={i.missingReservation > 0 ? "text-danger" : "text-warning"}>{i.issue}</div> : null}
                  </td>
                  <td>{i.cartons}</td><td>{i.unit_quantity}</td><td>{i.reserved_quantity}</td><td>{i.picked_quantity}/{i.remaining} db</td><td>{i.fulfilled_quantity}</td><td>{i.cancelled_quantity}</td>
                  <td>{money(i.net_unit_price_huf_snapshot)}</td><td>{money(i.gross_total_huf)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section-gap">
        <details className="card">
          <summary className="details-summary">LOT követés</summary>
          <div className="table-wrap section-gap-small">
            <table>
              <thead><tr><th>Termék</th><th>LOT</th><th>Karton</th><th>Lejárat</th><th>Mennyiség</th><th>Állapot</th><th>Átadva</th><th>Művelet</th></tr></thead>
              <tbody>
                {lotAllocations.map((allocation) => (
                  <tr key={allocation.id}>
                    <td>{allocation.product_name_snapshot}</td>
                    <td className="mono">{allocation.lot_number}</td>
                    <td className="mono">{allocation.carton_code ?? "—"}</td>
                    <td>{dateHU(allocation.best_before)}</td>
                    <td>{allocation.quantity_units} db</td>
                    <td><StatusBadge value={allocation.status} label={allocation.status} /></td>
                    <td>{dateTimeHU(allocation.delivered_at)}</td>
                    <td>
                      {allocation.carton_id && ["allocated", "picked"].includes(allocation.status) ? (
                        <UnpickCartonButton orderId={Number(id)} allocationId={Number(allocation.id)} cartonCode={allocation.carton_code} />
                      ) : <span className="text-muted">—</span>}
                    </td>
                  </tr>
                ))}
                {!lotAllocations.length ? <tr><td colSpan={8}>Még nincs LOT hozzárendelés ehhez a rendeléshez.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </details>
      </section>

      <section className="card section-gap">
        <h2>Összekészítési műveleti napló</h2>
        <div className="event-list">
          {cartonPickEvents.map((event) => (
            <div className="event-row" key={event.id}>
              <div>
                <strong>{event.event_type === "unpicked" ? "Visszavonva" : "Összekészítve"}</strong>
                <div>
                  <Link className="mono" href={`/internal/inventory/cartons/${event.carton_id}`}>{event.carton_code}</Link>
                  <span className="text-muted"> · {event.quantity_units ?? "—"} db</span>
                </div>
                <div className="text-muted">{event.product_name_snapshot ?? "Termék nélkül"} · LOT {event.lot_number ?? "—"}</div>
                {event.note ? <div className="text-muted">{event.note}</div> : null}
              </div>
              <div className="event-meta">
                <strong>{event.actor_name ?? "Rendszer"}</strong>
                <span>{dateTimeHU(event.created_at)}</span>
              </div>
            </div>
          ))}
          {!cartonPickEvents.length ? <div className="empty-inline">Ehhez a rendeléshez még nincs scanneres karton művelet.</div> : null}
        </div>
      </section>

      <section className="grid grid-2 section-gap">
        <div className="card">
          <h2>Követelések</h2>
          {receivables.length ? receivables.map((r) => (
            <div className="list-item" key={r.id}>
              <div><strong>{r.receivable_number}</strong><div className="text-muted">Esedékes: {dateHU(r.due_date)}</div></div>
              <div className="right"><strong>{money(r.outstanding_huf)}</strong><div><StatusBadge value={r.status} label={financeStatusLabels[r.status] ?? r.status} /></div></div>
            </div>
          )) : <div className="empty-state">Követelés az átadás rögzítésekor keletkezik automatikusan.</div>}
        </div>
        <div className="card">
          <h2>Állapottörténet</h2>
          <div className="list">
            {history.map((h) => (
              <div className="list-item" key={h.id}>
                <div><strong>{h.event_type}</strong><div className="text-muted">{h.note ?? ""}</div></div>
                <div className="right"><div>{h.display_name ?? "Rendszer"}</div><small className="text-muted">{dateTimeHU(h.changed_at)}</small></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
