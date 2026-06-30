import Link from "next/link";
import { requireAppUser } from "@/lib/auth";
import { one, query } from "@/lib/db";
import { dateHU, money } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { huLabel, orderStatusLabels, paymentMethodLabels } from "@/lib/status";
import { Catalog } from "./catalog/Catalog";

export default async function PartnerDashboardPage() {
  const user = await requireAppUser(["partner"]);
  const partner = await one<any>(`
    select p.*,
           coalesce(sum(v.outstanding_huf),0)::bigint as outstanding,
           coalesce(sum(v.outstanding_huf) filter (where v.due_date < current_date),0)::bigint as overdue_amount,
           (select string_agg(case d.weekday when 1 then 'Hétfő' when 2 then 'Kedd' when 3 then 'Szerda' when 4 then 'Csütörtök' when 5 then 'Péntek' when 6 then 'Szombat' else 'Vasárnap' end, ', ' order by d.weekday)
              from public.partner_delivery_days d where d.partner_id=p.id and d.active=true) as delivery_days
      from public.partners p
      left join public.v_receivables_open v on v.partner_id=p.id
     where p.id=$1 and p.organization_id=$2 and p.active=true and p.archived_at is null
     group by p.id
  `, [user.partner_id, user.organization_id]);
  const orders = await query<any>(`
    select id, order_number, requested_delivery_date, status, gross_total_huf
      from public.orders
     where partner_id=$1 and organization_id=$2 and archived_at is null
     order by created_at desc
     limit 5
  `, [user.partner_id, user.organization_id]);
  const products = await query<any>(`
    select p.id,p.code,p.sku,p.name,p.size_ml,p.units_per_carton,p.vat_rate_bps,p.status,
           coalesce(
             (select pli.net_unit_price_huf from public.price_list_items pli
               join public.price_lists pl on pl.id=pli.price_list_id
              where pli.product_id=p.id and pl.active=true and current_date>=pl.valid_from
                and (pl.valid_to is null or current_date<=pl.valid_to)
                and (pl.id=$2 or (pl.type='general' and pl.organization_id=$1))
              order by case when pl.id=$2 then 0 else 1 end,pl.valid_from desc limit 1),
             p.net_unit_price_huf
           )::int as net_unit_price_huf,
           coalesce(s.available_units,0)::int as available_units
      from public.products p
      left join public.v_product_stock_summary s on s.product_id=p.id
     where p.organization_id=$1 and p.active=true and p.status in ('active','seasonal')
     order by p.size_ml,p.sort_order
  `,[user.organization_id,partner?.price_list_id??null]);
  const blocked = partner?.overdue_policy === "block" && Number(partner?.overdue_amount ?? 0) > 0;

  return (
    <div>
      <section className="partner-dashboard-hero">
        <div className="partner-hero-main">
          <div>
            <h1>Partneri rendelő</h1>
            <p>{partner?.name ?? "Rendelés kartonban, a jóváhagyott szállítási napokra."}</p>
          </div>
          <Link href="/partner/cart" className="button button-primary">Kosár megnyitása</Link>
        </div>
        <div className="partner-hero-stats">
          <div><span>Nyitott követelés</span><strong>{money(partner?.outstanding)}</strong></div>
          <div><span>Minimum rendelés</span><strong>{partner?.minimum_order_cartons ?? 5} karton</strong></div>
          <div><span>Fizetés</span><strong>{huLabel(paymentMethodLabels, partner?.default_payment_method)}{partner?.default_payment_method === "bank_transfer" ? ` · ${partner?.payment_terms_days ?? 0} nap` : ""}</strong></div>
          <div><span>Szállítási nap</span><strong>{partner?.delivery_days ?? "—"}</strong></div>
        </div>
        <dl className="partner-hero-details">
          <dt>Számlázás</dt><dd>{partner?.billing_name ?? partner?.name ?? "—"}</dd>
          <dt>Adószám</dt><dd>{partner?.tax_number ?? "—"}</dd>
          <dt>Kapcsolat</dt><dd>{partner?.email ?? "—"}{partner?.phone ? ` · ${partner.phone}` : ""}</dd>
          <dt>Szállítási cím</dt><dd>{partner?.shipping_address ?? "—"}</dd>
        </dl>
      </section>
      {blocked ? <div className="alert alert-danger section-gap">A rendelésleadás lejárt tartozás miatt blokkolva van. A kosár használható, de beküldeni most nem lehet.</div> : null}
      <section className="section-gap">
        <div className="card-title-row"><h2>Termékek</h2><Link href="/partner/catalog" className="button button-small">Katalógus oldal</Link></div>
        <Catalog products={products} />
      </section>
      <section className="section-gap">
        <div className="card-title-row"><h2>Legutóbbi rendelések</h2><Link href="/partner/orders" className="button button-small">Összes</Link></div>
        <div className="table-wrap"><table><thead><tr><th>Rendelés</th><th>Szállítás</th><th>Állapot</th><th>Bruttó</th></tr></thead><tbody>
          {orders.map(o => <tr key={o.id}><td className="mono">{o.order_number}</td><td>{dateHU(o.requested_delivery_date)}</td><td><StatusBadge value={o.status} label={huLabel(orderStatusLabels, o.status)} /></td><td>{money(o.gross_total_huf)}</td></tr>)}
          {!orders.length ? <tr><td colSpan={4}>Még nincs rendelés.</td></tr> : null}
        </tbody></table></div>
      </section>
    </div>
  );
}
