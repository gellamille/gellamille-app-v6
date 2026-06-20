import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { requireAppUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { dateHU, money } from "@/lib/format";
import { orderStatusLabels } from "@/lib/status";

export default async function PartnerOrdersPage() {
  const user = await requireAppUser(["partner"]);
  const orders = await query<any>(`select * from public.orders where partner_id=$1 order by created_at desc`, [user.partner_id]);
  return (
    <div>
      <PageHeader title="Rendeléseim" />
      <div className="table-wrap"><table><thead><tr><th>Rendelés</th><th>Szállítás</th><th>Állapot</th><th>Karton</th><th>Bruttó</th></tr></thead><tbody>
        {orders.map(o=><tr key={o.id}><td><Link href={`/partner/orders/${o.id}`} className="mono">{o.order_number}</Link></td><td>{dateHU(o.requested_delivery_date)}</td><td><StatusBadge value={o.status} label={orderStatusLabels[o.status]??o.status} /></td><td>{o.total_cartons}</td><td>{money(o.gross_total_huf)}</td></tr>)}
      </tbody></table></div>
    </div>
  );
}
