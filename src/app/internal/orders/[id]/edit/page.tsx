import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { one, query } from "@/lib/db";
import { requireAppUser } from "@/lib/auth";
import { EditOrderForm } from "./EditOrderForm";

export default async function EditInternalOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAppUser(["admin", "management", "sales"]);
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) notFound();
  const order = await one<any>(`
    select o.*,p.name as partner_name
      from public.orders o
      join public.partners p on p.id=o.partner_id
     where o.id=$1 and o.organization_id=$2 and o.archived_at is null
  `, [orderId, user.organization_id]);
  if (!order) notFound();

  const items = await query<any>(`select * from public.order_items where order_id=$1 and unit_quantity > 0 order by id`, [order.id]);
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
  const addresses = await query<any>(`
    select pa.id,pa.name,pa.postal_code,pa.city,pa.address_line1
      from public.partner_addresses pa
      join public.partners p on p.id=pa.partner_id
     where pa.partner_id=$1 and p.organization_id=$2 and pa.active=true
     order by pa.is_default desc,pa.name
  `, [order.partner_id, user.organization_id]);
  const deliveryDays = await query<any>(`
    select d.weekday,d.cutoff_business_days
      from public.partner_delivery_days d
      join public.partners p on p.id=d.partner_id
     where d.partner_id=$1 and p.organization_id=$2 and d.active=true
     order by d.weekday
  `, [order.partner_id, user.organization_id]);

  return (
    <div className="page">
      <PageHeader title={`${order.order_number} szerkesztése`} description={`${order.partner_name} rendelésének módosítása.`} />
      <EditOrderForm order={order} items={items} products={products} addresses={addresses} deliveryDays={deliveryDays} />
    </div>
  );
}
