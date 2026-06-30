import { PageHeader } from "@/components/PageHeader";
import { requireAppUser } from "@/lib/auth";
import { one, query } from "@/lib/db";
import { CartCheckout } from "./CartCheckout";

export default async function CartPage() {
  const user = await requireAppUser(["partner"]);
  const partner = await one<any>(`
    select p.minimum_order_cartons,p.default_payment_method,p.price_list_id,p.overdue_policy,
           coalesce(sum(v.outstanding_huf) filter (where v.due_date < current_date),0)::bigint as overdue_amount
      from public.partners p
      left join public.v_receivables_open v on v.partner_id=p.id
     where p.id=$1 and p.organization_id=$2 and p.active=true and p.archived_at is null
     group by p.id
  `, [user.partner_id, user.organization_id]);
  const products = await query<any>(`
    select p.id,p.code,p.name,p.size_ml,p.units_per_carton,p.vat_rate_bps,
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
  const addresses = await query<any>(`
    select pa.id,pa.name,pa.postal_code,pa.city,pa.address_line1
      from public.partner_addresses pa
      join public.partners p on p.id=pa.partner_id
     where pa.partner_id=$1 and p.organization_id=$2 and pa.active=true
     order by pa.is_default desc,pa.name
  `, [user.partner_id, user.organization_id]);
  const deliveryDays = await query<any>(`
    select d.weekday,d.cutoff_business_days
      from public.partner_delivery_days d
      join public.partners p on p.id=d.partner_id
     where d.partner_id=$1 and p.organization_id=$2 and d.active=true
     order by d.weekday
  `, [user.partner_id, user.organization_id]);
  const blockedReason = partner?.overdue_policy === "block" && Number(partner?.overdue_amount ?? 0) > 0
    ? "A rendelésleadás lejárt tartozás miatt blokkolva van."
    : "";
  return (
    <div>
      <PageHeader title="Kosár és rendelés" description={`Minimum rendelés: ${partner?.minimum_order_cartons ?? 5} karton.`} />
      <CartCheckout products={products} addresses={addresses} deliveryDays={deliveryDays} minimum={partner?.minimum_order_cartons ?? 5} defaultPayment={partner?.default_payment_method ?? "bank_transfer"} blockedReason={blockedReason} />
    </div>
  );
}
