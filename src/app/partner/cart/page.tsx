import { PageHeader } from "@/components/PageHeader";
import { requireAppUser } from "@/lib/auth";
import { one, query } from "@/lib/db";
import { CartCheckout } from "./CartCheckout";

export default async function CartPage() {
  const user = await requireAppUser(["partner"]);
  const partner = await one<any>(`select minimum_order_cartons,default_payment_method,price_list_id from public.partners where id=$1`, [user.partner_id]);
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
           )::int as net_unit_price_huf
      from public.products p
     where p.organization_id=$1 and p.active=true and p.status in ('active','seasonal')
     order by p.size_ml,p.sort_order
  `,[user.organization_id,partner?.price_list_id??null]);
  const addresses = await query<any>(`select id,name,postal_code,city,address_line1 from public.partner_addresses where partner_id=$1 and active=true order by is_default desc,name`, [user.partner_id]);
  const deliveryDays = await query<any>(`select weekday,cutoff_business_days from public.partner_delivery_days where partner_id=$1 and active=true order by weekday`, [user.partner_id]);
  return (
    <div>
      <PageHeader title="Kosár és rendelés" description={`Minimum rendelés: ${partner?.minimum_order_cartons ?? 5} karton.`} />
      <CartCheckout products={products} addresses={addresses} deliveryDays={deliveryDays} minimum={partner?.minimum_order_cartons ?? 5} defaultPayment={partner?.default_payment_method ?? "bank_transfer"} />
    </div>
  );
}
