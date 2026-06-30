import { PageHeader } from "@/components/PageHeader";
import { query } from "@/lib/db";
import { requireAppUser } from "@/lib/auth";
import { InternalOrderForm } from "./InternalOrderForm";

export default async function NewInternalOrderPage() {
  const user = await requireAppUser(["admin", "management", "sales"]);

  const partners = await query<any>(`
    select p.id, p.name,
           coalesce((
             select jsonb_agg(jsonb_build_object(
               'weekday', d.weekday,
               'cutoff_business_days', d.cutoff_business_days
             ) order by d.weekday)
               from public.partner_delivery_days d
              where d.partner_id=p.id and d.active=true
           ), '[]'::jsonb) as delivery_days
      from public.partners p
     where p.organization_id=$1 and coalesce(p.active,true) = true and p.archived_at is null
     order by p.name
  `, [user.organization_id]);
  const products = await query<any>(`
    select p.id, p.code, p.name, p.size_ml, p.units_per_carton, p.net_unit_price_huf, p.vat_rate_bps,
           coalesce(s.physical_units,0)::int as physical_units,
           coalesce(s.reserved_units,0)::int as reserved_units,
           coalesce(s.available_units,0)::int as available_units
      from public.products p
      left join public.v_product_stock_summary s on s.product_id=p.id
     where p.organization_id=$1 and p.status in ('active','seasonal') and p.active = true
     order by p.size_ml, p.sort_order
  `, [user.organization_id]);
  return (
    <div className="page">
      <PageHeader title="Belső rendelés rögzítése" description="Telefonon vagy e-mailben érkezett partneri rendelés felvitele." />
      <InternalOrderForm partners={partners} products={products} />
    </div>
  );
}
