import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { requireAppUser } from "@/lib/auth";
import { one, query } from "@/lib/db";
import { dateWithWeekdayHU, money } from "@/lib/format";
import { financeStatusLabels, fulfillmentLabels, orderStatusLabels } from "@/lib/status";
import { WithdrawOrderButton } from "./WithdrawOrderButton";

export default async function PartnerOrderPage({params}:{params:Promise<{id:string}>}) {
  const user=await requireAppUser(["partner"]); const {id}=await params;
  const order=await one<any>(`select * from public.orders where id=$1 and partner_id=$2 and archived_at is null`,[id,user.partner_id]); if(!order)notFound();
  const items=await query<any>(`select * from public.order_items where order_id=$1 and unit_quantity > 0 order by id`,[id]);
  return <div><PageHeader title={order.order_number} description={`Kért szállítás: ${dateWithWeekdayHU(order.requested_delivery_date)}`} actions={order.status === "submitted" ? <WithdrawOrderButton orderId={Number(id)} /> : undefined} />
    <section className="grid grid-3"><div className="card"><h3>Rendelés</h3><StatusBadge value={order.status} label={orderStatusLabels[order.status]??order.status}/></div><div className="card"><h3>Teljesítés</h3><StatusBadge value={order.fulfillment_status} label={fulfillmentLabels[order.fulfillment_status]??order.fulfillment_status}/></div><div className="card"><h3>Pénzügy</h3><StatusBadge value={order.finance_status} label={financeStatusLabels[order.finance_status]??order.finance_status}/></div></section>
    <section className="section-gap table-wrap"><table><thead><tr><th>Termék</th><th>Karton</th><th>Darab</th><th>Nettó/db</th><th>Bruttó</th></tr></thead><tbody>{items.map(i=><tr key={i.id}><td>{i.product_name_snapshot}</td><td>{i.cartons}</td><td>{i.unit_quantity}</td><td>{money(i.net_unit_price_huf_snapshot)}</td><td>{money(i.gross_total_huf)}</td></tr>)}</tbody></table></section>
  </div>;
}
