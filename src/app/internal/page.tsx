import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query, one } from "@/lib/db";
import { money, dateHU } from "@/lib/format";
import { INTERNAL_ROLES, requireAppUser } from "@/lib/auth";
import { financeStatusLabels, fulfillmentLabels, orderStatusLabels } from "@/lib/status";

type Metrics = {
  submitted_orders: number;
  accepted_orders: number;
  packed_orders: number;
  low_stock_products: number;
  active_lots: number;
  receivables_huf: number;
};

export default async function DashboardPage() {
  await requireAppUser(INTERNAL_ROLES);

  const metrics = await one<Metrics>(`
    select
      (select count(*)::int from public.orders where status = 'submitted' and archived_at is null) as submitted_orders,
      (select count(*)::int from public.orders where status in ('approved','partially_approved','stock_shortage') and archived_at is null) as accepted_orders,
      (select count(*)::int from public.orders where fulfillment_status in ('packed','partially_delivered') and archived_at is null) as packed_orders,
      (select count(*)::int from public.v_product_stock_summary where available_units < minimum_stock_units) as low_stock_products,
      (select count(*)::int from public.lots where status = 'active') as active_lots,
      (select coalesce(sum(outstanding_huf),0)::bigint from public.v_receivables_open) as receivables_huf
  `);

  const orders = await query<any>(`
    select o.id, o.order_number, o.status, o.fulfillment_status, o.finance_status,
           o.requested_delivery_date, o.gross_total_huf, p.name as partner_name
      from public.orders o
      join public.partners p on p.id = o.partner_id
     where o.archived_at is null
       and (
        o.status in ('submitted','approved','partially_approved','stock_shortage')
        or o.fulfillment_status in ('packed','partially_delivered')
       )
     order by o.created_at desc
     limit 8
  `);

  const stockAlerts = await query<any>(`
    select product_id, product_name, product_code, available_units, minimum_stock_units
      from public.v_product_stock_summary
     where available_units < minimum_stock_units
     order by available_units, product_name
     limit 8
  `);

  const m = metrics ?? {
    submitted_orders: 0,
    accepted_orders: 0,
    packed_orders: 0,
    low_stock_products: 0,
    active_lots: 0,
    receivables_huf: 0
  };

  return (
    <div className="page">
      <PageHeader
        title="V7.1 MVP vezérlőpult"
        description="A stabil működési mag: rendelés, LOT, készlet, partner és követelés."
        actions={<Link href="/internal/orders" className="button button-primary">Rendelések kezelése</Link>}
      />

      <section className="grid grid-3">
        <Link href="/internal/orders?status=submitted" className="card metric"><div className="metric-label">Beérkezett rendelés</div><div className="metric-value">{m.submitted_orders}</div><div className="metric-note">Elfogadásra vár</div></Link>
        <Link href="/internal/orders?status=approved" className="card metric"><div className="metric-label">Elfogadott rendelés</div><div className="metric-value">{m.accepted_orders}</div><div className="metric-note">Foglalás vagy készlethiány alatt</div></Link>
        <Link href="/internal/orders?fulfillment=packed" className="card metric"><div className="metric-label">Átadásra kész</div><div className="metric-value">{m.packed_orders}</div><div className="metric-note">Összekészített rendelés</div></Link>
        <Link href="/internal/production" className="card metric"><div className="metric-label">Aktív LOT</div><div className="metric-value">{m.active_lots}</div><div className="metric-note">Eladható életciklusban</div></Link>
        <Link href="/internal/inventory" className="card metric"><div className="metric-label">Kritikus készlet</div><div className="metric-value">{m.low_stock_products}</div><div className="metric-note">Minimumszint alatt</div></Link>
        <Link href="/internal/finance" className="card metric"><div className="metric-label">Nyitott követelés</div><div className="metric-value">{money(m.receivables_huf)}</div><div className="metric-note">Átadáskor keletkezik</div></Link>
      </section>

      <section className="grid grid-2 section-gap">
        <div>
          <div className="card-title-row"><h2>MVP rendelési sor</h2><Link href="/internal/orders" className="button button-small">Összes</Link></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Rendelés</th><th>Partner</th><th>Szállítás</th><th>Rendelés</th><th>Teljesítés</th><th>Pénzügy</th><th>Bruttó</th></tr></thead>
              <tbody>
                {orders.length ? orders.map((order) => (
                  <tr key={order.id}>
                    <td><Link href={`/internal/orders/${order.id}`} className="mono">{order.order_number}</Link></td>
                    <td>{order.partner_name}</td>
                    <td>{dateHU(order.requested_delivery_date)}</td>
                    <td><StatusBadge value={order.status} label={orderStatusLabels[order.status] ?? order.status} /></td>
                    <td><StatusBadge value={order.fulfillment_status} label={fulfillmentLabels[order.fulfillment_status] ?? order.fulfillment_status} /></td>
                    <td><StatusBadge value={order.finance_status} label={financeStatusLabels[order.finance_status] ?? order.finance_status} /></td>
                    <td>{money(order.gross_total_huf)}</td>
                  </tr>
                )) : <tr><td colSpan={7}>Nincs nyitott MVP rendelési művelet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-title-row"><h2>Készletjelzések</h2><Link href="/internal/inventory" className="button button-small">Készletlista</Link></div>
          <div className="list">
            {stockAlerts.length ? stockAlerts.map((item) => (
              <div className="list-item" key={item.product_id}>
                <div><strong>{item.product_name}</strong><div className="text-muted mono">{item.product_code}</div></div>
                <div className="right"><strong>{item.available_units} db</strong><div className="text-muted">minimum: {item.minimum_stock_units} db</div></div>
              </div>
            )) : <div className="empty-state">Nincs minimum alatti termék.</div>}
          </div>
        </div>
      </section>
    </div>
  );
}
