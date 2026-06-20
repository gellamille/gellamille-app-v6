import { PageHeader } from "@/components/PageHeader";
import { requireAppUser } from "@/lib/auth";
import { one, query } from "@/lib/db";
import { Catalog } from "./Catalog";

export default async function CatalogPage() {
  const user=await requireAppUser(["partner"]);
  const partner=await one<any>(`select price_list_id from public.partners where id=$1`,[user.partner_id]);
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
  return (
    <div>
      <PageHeader title="Termékek" description="A rendelés kartonban történik. A készletinformáció tájékoztató jellegű, a foglalás elfogadáskor történik." />
      <Catalog products={products} />
    </div>
  );
}
