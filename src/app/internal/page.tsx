import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query, one } from "@/lib/db";
import { money, dateHU } from "@/lib/format";
import { orderStatusLabels } from "@/lib/status";

type Metrics = {
  active_orders: number;
  delivery_waiting: number;
  low_stock_products: number;
  expiring_lots: number;
  receivables_huf: number;
  overdue_huf: number;
  month_sales_huf: number;
  open_tasks: number;
};

export default async function DashboardPage() {
  const metrics = await one<Metrics>(`
    select
      (select count(*)::int from public.orders where status in ('submitted','approved','partially_approved','stock_shortage')) as active_orders,
      (select count(*)::int from public.deliveries where status in ('planned','picking','loaded','in_transit')) as delivery_waiting,
      (select count(*)::int from public.v_product_stock_summary where available_units < minimum_stock_units) as low_stock_products,
      (select count(*)::int from public.lots where status = 'active' and best_before between current_date and current_date + 30) as expiring_lots,
      (select coalesce(sum(outstanding_huf),0)::bigint from public.v_receivables_open) as receivables_huf,
      (select coalesce(sum(outstanding_huf),0)::bigint from public.v_receivables_open where due_date < current_date) as overdue_huf,
      (select coalesce(sum(gross_amount_huf),0)::bigint from public.receivables where delivered_at >= date_trunc('month', current_date)) as month_sales_huf,
      (select count(*)::int from public.tasks where status in ('open','in_progress') and archived_at is null) as open_tasks
  `);

  const topProducts = await query<{ product_name: string; delivered_units: number }>(`
    select product_name_snapshot as product_name, sum(di.delivered_units)::int as delivered_units
      from public.delivery_items di
      join public.order_items oi on oi.id = di.order_item_id
      join public.deliveries d on d.id = di.delivery_id and d.status = 'delivered'
     where d.delivered_at >= date_trunc('month', current_date)
     group by product_name_snapshot
     order by delivered_units desc
     limit 3
  `);

  const topPartners = await query<{ partner_name: string; gross_huf: number }>(`
    select p.name as partner_name, sum(r.gross_amount_huf)::bigint as gross_huf
      from public.receivables r
      join public.partners p on p.id = r.partner_id
     where r.delivered_at >= date_trunc('month', current_date)
     group by p.id, p.name
     order by gross_huf desc
     limit 3
  `);

  const orders = await query<any>(`
    select o.id, o.order_number, o.status, o.requested_delivery_date,
           o.gross_total_huf, p.name as partner_name
      from public.orders o
      join public.partners p on p.id = o.partner_id
     where o.status not in ('draft','closed','rejected','cancelled','void')
     order by o.created_at desc
     limit 8
  `);

  const alerts = await query<any>(`
    select 'expiry' as kind, l.lot_number as title,
           'Lejár: ' || to_char(l.best_before, 'YYYY.MM.DD') as detail,
           l.best_before::text as sort_date
      from public.lots l
     where l.status = 'active'
       and l.best_before between current_date and current_date + 30
    union all
    select 'stock', product_name,
           'Szabad készlet: ' || available_units || ' db',
           current_date::text
      from public.v_product_stock_summary
     where available_units < minimum_stock_units
    order by sort_date
    limit 8
  `);

  const m = metrics ?? {
    active_orders: 0, delivery_waiting: 0, low_stock_products: 0, expiring_lots: 0,
    receivables_huf: 0, overdue_huf: 0, month_sales_huf: 0, open_tasks: 0
  };

  return (
    <div className="page">
      <PageHeader
        title="Vezérlőpult"
        description="A napi működés legfontosabb rendelési, készlet-, szállítási és pénzügyi jelzései."
        actions={<Link href="/internal/production/new" className="button button-primary">Új LOT</Link>}
      />

      <section className="grid grid-4">
        <div className="card metric"><div className="metric-label">Aktív rendelések</div><div className="metric-value">{m.active_orders}</div><div className="metric-note">Beérkezett és elfogadott</div></div>
        <div className="card metric"><div className="metric-label">Kiszállításra vár</div><div className="metric-value">{m.delivery_waiting}</div><div className="metric-note">Tervezett vagy folyamatban</div></div>
        <div className="card metric"><div className="metric-label">Havi értékesítés</div><div className="metric-value">{money(m.month_sales_huf)}</div><div className="metric-note">Átadott mennyiség alapján</div></div>
        <div className="card metric"><div className="metric-label">Követelések</div><div className="metric-value">{money(m.receivables_huf)}</div><div className="metric-note">{money(m.overdue_huf)} lejárt</div></div>
        <div className="card metric"><div className="metric-label">Alacsony készlet</div><div className="metric-value">{m.low_stock_products}</div><div className="metric-note">Minimumszint alatt</div></div>
        <div className="card metric"><div className="metric-label">30 napon belül lejár</div><div className="metric-value">{m.expiring_lots}</div><div className="metric-note">Aktív LOT</div></div>
        <div className="card metric"><div className="metric-label">Nyitott feladat</div><div className="metric-value">{m.open_tasks}</div><div className="metric-note">Kézi és automatikus</div></div>
        <div className="card metric"><div className="metric-label">Készlet logika</div><div className="metric-value">FEFO</div><div className="metric-note">A leghamarabb lejáró LOT az első</div></div>
      </section>

      <section className="grid grid-2 section-gap">
        <div className="card">
          <div className="card-title-row"><h2>Top 3 termék</h2><Link href="/internal/analytics" className="button button-small">Elemzés</Link></div>
          <div className="list">
            {topProducts.length ? topProducts.map((item, i) => (
              <div className="list-item" key={item.product_name}><span>{i + 1}. {item.product_name}</span><strong>{item.delivered_units} db</strong></div>
            )) : <div className="empty-state">Még nincs átadott rendelés ebben a hónapban.</div>}
          </div>
        </div>
        <div className="card">
          <div className="card-title-row"><h2>Top 3 partner</h2><Link href="/internal/partners" className="button button-small">Partnerek</Link></div>
          <div className="list">
            {topPartners.length ? topPartners.map((item, i) => (
              <div className="list-item" key={item.partner_name}><span>{i + 1}. {item.partner_name}</span><strong>{money(item.gross_huf)}</strong></div>
            )) : <div className="empty-state">Még nincs partnerforgalom ebben a hónapban.</div>}
          </div>
        </div>
      </section>

      <section className="grid grid-2 section-gap">
        <div>
          <div className="card-title-row"><h2>Aktív rendelések</h2><Link href="/internal/orders" className="button button-small">Összes</Link></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Rendelés</th><th>Partner</th><th>Szállítás</th><th>Státusz</th><th>Bruttó</th></tr></thead>
              <tbody>
                {orders.length ? orders.map((order) => (
                  <tr key={order.id}>
                    <td><Link href={`/internal/orders/${order.id}`} className="mono">{order.order_number}</Link></td>
                    <td>{order.partner_name}</td>
                    <td>{dateHU(order.requested_delivery_date)}</td>
                    <td><StatusBadge value={order.status} label={orderStatusLabels[order.status]} /></td>
                    <td>{money(order.gross_total_huf)}</td>
                  </tr>
                )) : <tr><td colSpan={5}>Nincs aktív rendelés.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-title-row"><h2>Figyelmeztetések</h2><span className="badge">{alerts.length}</span></div>
          <div className="list">
            {alerts.length ? alerts.map((alert, i) => (
              <div className="list-item" key={`${alert.kind}-${i}`}>
                <div><strong>{alert.title}</strong><div className="text-muted">{alert.detail}</div></div>
                <span className={`badge badge-${alert.kind === "expiry" ? "expired" : "stock_shortage"}`}>{alert.kind === "expiry" ? "Lejárat" : "Készlet"}</span>
              </div>
            )) : <div className="empty-state">Nincs sürgős készlet- vagy lejárati jelzés.</div>}
          </div>
        </div>
      </section>
    </div>
  );
}
