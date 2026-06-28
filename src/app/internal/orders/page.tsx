import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { money, dateHU } from "@/lib/format";
import { INTERNAL_ROLES, requireAppUser } from "@/lib/auth";
import { financeStatusLabels, fulfillmentLabels, huLabel, orderStatusLabels } from "@/lib/status";

type SearchParams = Record<string, string | string[] | undefined>;

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function OrdersPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  await requireAppUser(INTERNAL_ROLES);
  const filters = await searchParams;
  const from = single(filters?.from) ?? "";
  const to = single(filters?.to) ?? "";
  const partnerId = single(filters?.partnerId) ?? "";
  const status = single(filters?.status) ?? "";
  const fulfillment = single(filters?.fulfillment) ?? "";

  const where = ["o.archived_at is null"];
  const values: unknown[] = [];
  if (from) { values.push(from); where.push(`o.requested_delivery_date >= $${values.length}::date`); }
  if (to) { values.push(to); where.push(`o.requested_delivery_date <= $${values.length}::date`); }
  if (partnerId) { values.push(Number(partnerId)); where.push(`o.partner_id = $${values.length}`); }
  if (status) { values.push(status); where.push(`o.status = $${values.length}`); }
  if (fulfillment) { values.push(fulfillment); where.push(`o.fulfillment_status = $${values.length}`); }
  const whereSql = where.length ? `where ${where.join(" and ")}` : "";

  const partners = await query<any>(`select id,name from public.partners where active and archived_at is null order by name`);
  const orders = await query<any>(`
    select o.*, p.name as partner_name,
           coalesce(sum(oi.reserved_quantity),0)::int as reserved_units,
           coalesce(sum(oi.fulfilled_quantity),0)::int as fulfilled_units
      from public.orders o
      join public.partners p on p.id = o.partner_id
      left join public.order_items oi on oi.order_id = o.id
     ${whereSql}
     group by o.id, p.name
     order by o.created_at desc
     limit 250
  `, values);

  return (
    <div className="page">
      <PageHeader
        title="Rendelések"
        description="A partneri rendelések üzleti, teljesítési és pénzügyi állapota külön követhető."
        actions={<Link className="button button-primary" href="/internal/orders/new">Belső rendelés rögzítése</Link>}
      />
      <form className="card filter-bar section-gap-small" action="/internal/orders">
        <label>Időszak kezdete<input name="from" type="date" defaultValue={from} /></label>
        <label>Időszak vége<input name="to" type="date" defaultValue={to} /></label>
        <label>Partner<select name="partnerId" defaultValue={partnerId}><option value="">Összes partner</option>{partners.map((partner) => <option key={partner.id} value={partner.id}>{partner.name}</option>)}</select></label>
        <label>Rendelési állapot<select name="status" defaultValue={status}><option value="">Összes</option>{Object.entries(orderStatusLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>Teljesítés<select name="fulfillment" defaultValue={fulfillment}><option value="">Összes</option>{Object.entries(fulfillmentLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <div className="inline filter-actions"><button className="button button-primary">Szűrés</button><Link className="button" href="/internal/orders">Törlés</Link></div>
      </form>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Rendelés</th><th>Partner</th><th>Kért nap</th><th>Rendelési állapot</th><th>Teljesítés</th><th>Pénzügy</th><th>Karton</th><th>Bruttó</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td><Link href={`/internal/orders/${o.id}`} className="mono">{o.order_number}</Link></td>
                <td>{o.partner_name}</td>
                <td>{dateHU(o.requested_delivery_date)}</td>
                <td><StatusBadge value={o.status} label={huLabel(orderStatusLabels, o.status)} /></td>
                <td><StatusBadge value={o.fulfillment_status} label={huLabel(fulfillmentLabels, o.fulfillment_status)} /></td>
                <td><StatusBadge value={o.finance_status} label={huLabel(financeStatusLabels, o.finance_status)} /></td>
                <td>{o.total_cartons}</td>
                <td>{money(o.gross_total_huf)}</td>
              </tr>
            ))}
            {!orders.length ? <tr><td colSpan={8}>Még nincs rendelés.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
