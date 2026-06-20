import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { money, dateHU } from "@/lib/format";
import { financeStatusLabels, fulfillmentLabels, orderStatusLabels } from "@/lib/status";

export default async function OrdersPage() {
  const orders = await query<any>(`
    select o.*, p.name as partner_name,
           coalesce(sum(oi.reserved_quantity),0)::int as reserved_units,
           coalesce(sum(oi.fulfilled_quantity),0)::int as fulfilled_units
      from public.orders o
      join public.partners p on p.id = o.partner_id
      left join public.order_items oi on oi.order_id = o.id
     group by o.id, p.name
     order by o.created_at desc
     limit 250
  `);

  return (
    <div className="page">
      <PageHeader
        title="Rendelések"
        description="A partneri rendelések üzleti, teljesítési és pénzügyi állapota külön követhető."
        actions={<Link className="button button-primary" href="/internal/orders/new">Belső rendelés rögzítése</Link>}
      />
      <div className="table-wrap">
        <table>
          <thead><tr><th>Rendelés</th><th>Partner</th><th>Kért nap</th><th>Rendelési állapot</th><th>Teljesítés</th><th>Pénzügy</th><th>Karton</th><th>Bruttó</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td><Link href={`/internal/orders/${o.id}`} className="mono">{o.order_number}</Link></td>
                <td>{o.partner_name}</td>
                <td>{dateHU(o.requested_delivery_date)}</td>
                <td><StatusBadge value={o.status} label={orderStatusLabels[o.status] ?? o.status} /></td>
                <td><StatusBadge value={o.fulfillment_status} label={fulfillmentLabels[o.fulfillment_status] ?? o.fulfillment_status} /></td>
                <td><StatusBadge value={o.finance_status} label={financeStatusLabels[o.finance_status] ?? o.finance_status} /></td>
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
