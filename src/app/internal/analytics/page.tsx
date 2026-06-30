import { PageHeader } from "@/components/PageHeader";
import { query } from "@/lib/db";
import { money } from "@/lib/format";
import { requireAppUser } from "@/lib/auth";

function numberHU(value: number | string | null | undefined) {
  return new Intl.NumberFormat("hu-HU").format(Number(value ?? 0));
}

function percent(value: number | string | null | undefined) {
  return `${new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 1 }).format(Number(value ?? 0))}%`;
}

export default async function AnalyticsPage() {
  const user = await requireAppUser(["admin", "management", "finance"]);
  const [summary] = await query<any>(`
    with delivered as (
      select d.id,d.delivered_at,di.gross_amount_huf,di.net_amount_huf,di.cogs_huf,di.delivered_units,d.order_id,o.partner_id
        from public.delivery_items di
        join public.deliveries d on d.id=di.delivery_id and d.status='delivered'
        join public.orders o on o.id=d.order_id
       where d.organization_id=$1 and d.archived_at is null
    ), current_month as (
      select coalesce(sum(gross_amount_huf),0) gross, coalesce(sum(net_amount_huf),0) net, coalesce(sum(cogs_huf),0) cogs, coalesce(sum(delivered_units),0) units
        from delivered
       where delivered_at >= date_trunc('month', now())
    ), previous_month as (
      select coalesce(sum(gross_amount_huf),0) gross
        from delivered
       where delivered_at >= date_trunc('month', now()) - interval '1 month'
         and delivered_at < date_trunc('month', now())
    )
    select
      (select gross from current_month)::bigint as month_gross,
      (select net from current_month)::bigint as month_net,
      (select cogs from current_month)::bigint as month_cogs,
      ((select gross from current_month)-(select cogs from current_month))::bigint as month_margin,
      (select units from current_month)::int as month_units,
      (select count(*) from public.orders where organization_id=$1 and archived_at is null and created_at >= date_trunc('month', now()))::int as month_orders,
      (select count(*) from public.partners where organization_id=$1 and archived_at is null and active=true)::int as active_partners,
      (select coalesce(sum(v.outstanding_huf),0) from public.v_receivables_open v join public.orders o on o.id=v.order_id where o.organization_id=$1)::bigint as outstanding,
      (select coalesce(sum(v.outstanding_huf),0) from public.v_receivables_open v join public.orders o on o.id=v.order_id where o.organization_id=$1 and v.status='overdue')::bigint as overdue,
      case when (select gross from previous_month)>0
        then round((((select gross from current_month)-(select gross from previous_month))::numeric/(select gross from previous_month))*100,1)
        else null end as month_growth_percent
  `, [user.organization_id]);

  const trend = await query<any>(`
    select to_char(month_start,'YYYY. MM.') as month_label,
           coalesce(sum(di.gross_amount_huf),0)::bigint as gross,
           coalesce(sum(di.delivered_units),0)::int as units,
           count(distinct d.order_id)::int as orders
      from generate_series(date_trunc('month', now()) - interval '5 month', date_trunc('month', now()), interval '1 month') month_start
      left join public.deliveries d on d.organization_id=$1 and d.status='delivered' and d.archived_at is null and date_trunc('month', d.delivered_at)=month_start
      left join public.delivery_items di on di.delivery_id=d.id
     group by month_start
     order by month_start
  `, [user.organization_id]);

  const partners = await query<any>(`
    with partner_revenue as (
      select p.id,p.name,
             coalesce(sum(di.gross_amount_huf),0)::bigint as revenue,
             coalesce(sum(di.delivered_units),0)::int as units,
             count(distinct d.order_id)::int as orders
       from public.partners p
        left join public.orders o on o.partner_id=p.id and o.organization_id=p.organization_id and o.archived_at is null
        left join public.deliveries d on d.order_id=o.id and d.status='delivered' and d.archived_at is null
        left join public.delivery_items di on di.delivery_id=d.id
       where p.organization_id=$1 and p.archived_at is null
       group by p.id,p.name
    ), total as (
      select nullif(sum(revenue),0) as revenue from partner_revenue
    )
    select pr.*, round((pr.revenue::numeric / total.revenue) * 100,1) as share_percent,
           (select coalesce(sum(v.outstanding_huf),0) from public.v_receivables_open v where v.partner_id=pr.id)::bigint as outstanding
      from partner_revenue pr,total
     order by pr.revenue desc
     limit 10
  `, [user.organization_id]);

  const products = await query<any>(`
    with product_revenue as (
      select oi.product_name_snapshot as name,
             coalesce(sum(di.delivered_units),0)::int as units,
             coalesce(sum(di.gross_amount_huf),0)::bigint as revenue,
             coalesce(sum(di.cogs_huf),0)::bigint as cogs
        from public.delivery_items di
        join public.order_items oi on oi.id=di.order_item_id
        join public.deliveries d on d.id=di.delivery_id and d.status='delivered'
       where d.organization_id=$1 and d.archived_at is null
       group by oi.product_name_snapshot
    ), total as (
      select nullif(sum(revenue),0) as revenue from product_revenue
    )
    select pr.*, (pr.revenue-pr.cogs)::bigint as margin,
           round((pr.revenue::numeric / total.revenue) * 100,1) as share_percent
      from product_revenue pr,total
     order by pr.revenue desc
     limit 10
  `, [user.organization_id]);

  const receivables = await query<any>(`
    select p.name,
           coalesce(sum(v.outstanding_huf),0)::bigint as outstanding,
           coalesce(sum(v.outstanding_huf) filter(where v.status='overdue'),0)::bigint as overdue
      from public.v_receivables_open v
      join public.partners p on p.id=v.partner_id
     where p.organization_id=$1
     group by p.name
     order by outstanding desc
     limit 10
  `, [user.organization_id]);

  const stockRisks = await query<any>(`
    select s.product_name,s.available_units,s.reserved_units,s.minimum_stock_units,
           (s.available_units-s.minimum_stock_units)::int as surplus
      from public.v_product_stock_summary s
      join public.products p on p.id=s.product_id
     where p.organization_id=$1 and s.available_units <= s.minimum_stock_units + 500
     order by surplus asc, s.product_name
     limit 10
  `, [user.organization_id]);

  return (
    <div className="page">
      <PageHeader title="Elemzések" description="Tulajdonosi és vezetői riport: forgalom, koncentráció, kintlévőség, termékmix és készletkockázat." />

      <section className="grid grid-4">
        <div className="card metric"><div className="metric-label">Havi bruttó árbevétel</div><div className="metric-value">{money(summary.month_gross)}</div><div className="metric-note">Előző hónaphoz képest: {summary.month_growth_percent === null ? "nincs bázis" : percent(summary.month_growth_percent)}</div></div>
        <div className="card metric"><div className="metric-label">Havi árrés</div><div className="metric-value">{money(summary.month_margin)}</div><div className="metric-note">Nettó: {money(summary.month_net)}, COGS: {money(summary.month_cogs)}</div></div>
        <div className="card metric"><div className="metric-label">Rendelések / darab</div><div className="metric-value">{numberHU(summary.month_orders)} / {numberHU(summary.month_units)}</div><div className="metric-note">Aktív partnerek: {numberHU(summary.active_partners)}</div></div>
        <div className="card metric metric-warning"><div className="metric-label">Nyitott követelés</div><div className="metric-value">{money(summary.outstanding)}</div><div className="metric-note">Lejárt: {money(summary.overdue)}</div></div>
      </section>

      <section className="grid grid-2 section-gap">
        <div className="card">
          <h2>6 havi forgalmi trend</h2>
          <div className="table-wrap"><table><thead><tr><th>Hónap</th><th>Árbevétel</th><th>Rendelés</th><th>Darab</th></tr></thead><tbody>
            {trend.map((row) => <tr key={row.month_label}><td>{row.month_label}</td><td>{money(row.gross)}</td><td>{numberHU(row.orders)}</td><td>{numberHU(row.units)}</td></tr>)}
          </tbody></table></div>
        </div>

        <div className="card">
          <h2>Partner koncentráció</h2>
          <div className="table-wrap"><table><thead><tr><th>Partner</th><th>Árbevétel</th><th>Arány</th><th>Követelés</th></tr></thead><tbody>
            {partners.map((row) => <tr key={row.id}><td>{row.name}</td><td>{money(row.revenue)}</td><td>{percent(row.share_percent)}</td><td>{money(row.outstanding)}</td></tr>)}
          </tbody></table></div>
        </div>

        <div className="card">
          <h2>Termékmix árbevétel szerint</h2>
          <div className="table-wrap"><table><thead><tr><th>Termék</th><th>Árbevétel</th><th>Arány</th><th>Árrés</th><th>Darab</th></tr></thead><tbody>
            {products.map((row) => <tr key={row.name}><td>{row.name}</td><td>{money(row.revenue)}</td><td>{percent(row.share_percent)}</td><td>{money(row.margin)}</td><td>{numberHU(row.units)}</td></tr>)}
          </tbody></table></div>
        </div>

        <div className="card">
          <h2>Kintlévőség fókusz</h2>
          <div className="table-wrap"><table><thead><tr><th>Partner</th><th>Nyitott</th><th>Lejárt</th></tr></thead><tbody>
            {receivables.map((row) => <tr key={row.name}><td>{row.name}</td><td>{money(row.outstanding)}</td><td>{money(row.overdue)}</td></tr>)}
            {!receivables.length ? <tr><td colSpan={3}>Nincs nyitott követelés.</td></tr> : null}
          </tbody></table></div>
        </div>

        <div className="card">
          <h2>Készletkockázat</h2>
          <div className="table-wrap"><table><thead><tr><th>Termék</th><th>Elérhető</th><th>Foglalt</th><th>Minimum</th><th>Eltérés</th></tr></thead><tbody>
            {stockRisks.map((row) => <tr key={row.product_name}><td>{row.product_name}</td><td>{numberHU(row.available_units)}</td><td>{numberHU(row.reserved_units)}</td><td>{numberHU(row.minimum_stock_units)}</td><td>{numberHU(row.surplus)}</td></tr>)}
            {!stockRisks.length ? <tr><td colSpan={5}>Nincs közeli készletkockázat.</td></tr> : null}
          </tbody></table></div>
        </div>
      </section>
    </div>
  );
}
