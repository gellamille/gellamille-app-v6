import { PageHeader } from "@/components/PageHeader";
import { requireAppUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { ProductEditor } from "./ProductEditor";

export default async function ProductsPage() {
  const user = await requireAppUser(["admin", "management", "production", "sales", "staff"]);
  const canWrite = ["admin", "management", "production", "sales"].includes(user.role);

  const products = await query<any>(`
    select p.*, f.name as flavor_name
      from public.products p join public.flavors f on f.code=p.flavor_code
     where p.organization_id=$1 and p.archived_at is null
     order by p.size_ml,p.sort_order
  `, [user.organization_id]);

  return (
    <div className="page">
      <PageHeader
        title="Termékek"
        description="SKU-k, kartonlogika és árak. A módosítások a jövőbeli rendelésekre érvényesek, a korábbi rendelések és LOT-ok értékei nem íródnak át."
      />
      <ProductEditor products={products} canWrite={canWrite} />
    </div>
  );
}
