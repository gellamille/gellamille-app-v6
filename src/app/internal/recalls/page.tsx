import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { dateTimeHU, dateHU } from "@/lib/format";
import { requireAppUser } from "@/lib/auth";
import { huLabel, lotStatusLabels, recallStatusLabels } from "@/lib/status";
import { RecallForm } from "./RecallForm";

type SearchParams = Record<string, string | string[] | undefined>;

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function RecallsPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const user = await requireAppUser(["admin", "management", "warehouse", "production", "staff", "sales"]);
  const params = await searchParams;
  const orderId = Number(single(params?.orderId) ?? 0);
  const preselectedLots = Number.isInteger(orderId) && orderId > 0 ? await query<any>(`
    select distinct l.id
      from public.order_item_lot_allocations a
      join public.lots l on l.id=a.lot_id
      join public.order_items oi on oi.id=a.order_item_id
      join public.orders o on o.id=oi.order_id
     where oi.order_id=$1 and o.archived_at is null
  `, [orderId]) : [];
  const lots = await query<any>(`
    select l.id,l.lot_number,l.best_before,l.status,p.name as product_name,
           coalesce(v.available_units,0)::int as available_units
      from public.lots l
      join public.products p on p.flavor_code=l.flavor_code and p.size_ml=l.size_ml and p.organization_id=l.organization_id
      left join public.v_lot_stock_summary v on v.lot_id=l.id
     where l.organization_id=$1
       and l.status not in ('void','scrapped','recalled')
     order by l.production_date desc,l.id desc
     limit 400
  `, [user.organization_id]);
  const lotIds = lots.map((lot) => Number(lot.id));
  const recallDestinations = lotIds.length ? await query<any>(`
    select
      a.lot_id,
      p.name as partner_name,
      p.email as partner_email,
      o.order_number,
      coalesce(d.delivered_at,a.delivered_at) as delivered_at,
      concat_ws(', ',pa.postal_code,pa.city,pa.address_line1) as delivery_address,
      coalesce(sum(a.quantity_units),0)::int as quantity_units
      from public.order_item_lot_allocations a
      join public.lots l on l.id=a.lot_id
      join public.order_items oi on oi.id=a.order_item_id
      join public.orders o on o.id=oi.order_id
      join public.partners p on p.id=o.partner_id
      left join public.delivery_items di on di.order_item_id=oi.id
      left join public.deliveries d on d.id=di.delivery_id and d.status='delivered' and d.archived_at is null
      left join public.partner_addresses pa on pa.id=coalesce(d.address_id,o.delivery_address_id)
     where a.lot_id=any($1::bigint[])
       and a.status='delivered'
       and l.organization_id=$2
       and o.archived_at is null
     group by a.lot_id,p.name,p.email,o.order_number,coalesce(d.delivered_at,a.delivered_at),concat_ws(', ',pa.postal_code,pa.city,pa.address_line1)
     order by p.name,o.order_number
  `, [lotIds, user.organization_id]) : [];
  const recalls = await query<any>(`
    select r.*,count(rl.lot_id)::int as lot_count
      from public.product_recalls r
      left join public.product_recall_lots rl on rl.recall_id=r.id
     where r.organization_id=$1
       and r.archived_at is null
     group by r.id
     order by r.opened_at desc
     limit 100
  `, [user.organization_id]);
  const recallLots = await query<any>(`
    select rl.recall_id,l.lot_number,p.name as product_name,l.status,l.recalled_at
      from public.product_recall_lots rl
      join public.lots l on l.id=rl.lot_id
      join public.products p on p.flavor_code=l.flavor_code and p.size_ml=l.size_ml and p.organization_id=l.organization_id
     where l.organization_id=$1
     order by l.recalled_at desc,l.lot_number
     limit 300
  `, [user.organization_id]);

  return (
    <div className="page">
      <PageHeader title="Visszahívás" description="LOT szám alapján indított visszahívás. A rendszer értesítést és e-mail sort készít az érintett partnereknek." />
      {["admin", "management", "warehouse", "production"].includes(user.role) ? <RecallForm lots={lots} preselectedLotIds={preselectedLots.map((row) => Number(row.id))} recallDestinations={recallDestinations} /> : null}
      <section className="grid grid-2 section-gap">
        <div>
          <h2>Visszahívások</h2>
          <div className="table-wrap"><table><thead><tr><th>Cím</th><th>Nyitva</th><th>LOT</th><th>Állapot</th><th>Indok</th></tr></thead><tbody>
            {recalls.map((recall) => <tr key={recall.id}><td>{recall.title}</td><td>{dateTimeHU(recall.opened_at)}</td><td>{recall.lot_count}</td><td><StatusBadge value={recall.status} label={huLabel(recallStatusLabels, recall.status)} /></td><td>{recall.reason}</td></tr>)}
            {!recalls.length ? <tr><td colSpan={5}>Még nincs visszahívás.</td></tr> : null}
          </tbody></table></div>
        </div>
        <div>
          <h2>Érintett LOT-ok</h2>
          <div className="table-wrap"><table><thead><tr><th>LOT</th><th>Termék</th><th>Visszahívva</th><th>Állapot</th></tr></thead><tbody>
            {recallLots.map((lot) => <tr key={`${lot.recall_id}-${lot.lot_number}`}><td className="mono">{lot.lot_number}</td><td>{lot.product_name}</td><td>{dateHU(lot.recalled_at)}</td><td><StatusBadge value={lot.status} label={huLabel(lotStatusLabels, lot.status)} /></td></tr>)}
            {!recallLots.length ? <tr><td colSpan={4}>Még nincs visszahívott LOT.</td></tr> : null}
          </tbody></table></div>
        </div>
      </section>
    </div>
  );
}
