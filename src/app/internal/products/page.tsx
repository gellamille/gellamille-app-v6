import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { money } from "@/lib/format";

export default async function ProductsPage() {
  const products = await query<any>(`
    select p.*, f.name as flavor_name
      from public.products p join public.flavors f on f.code=p.flavor_code
     order by p.size_ml,p.sort_order
  `);
  return (
    <div className="page">
      <PageHeader title="Termékek" description="16 SKU: 8 íz × 2 kiszerelés. Állapot, kartonlogika, eladási és beszerzési egységár." />
      <div className="table-wrap"><table><thead><tr><th>SKU</th><th>Terméknév</th><th>Méret</th><th>Karton</th><th>Nettó átadási ár</th><th>Nettó beszerzési ár</th><th>Minimum készlet</th><th>Állapot</th></tr></thead><tbody>
        {products.map(p => <tr key={p.id}><td className="mono">{p.sku ?? `GM-${p.flavor_code}-${p.size_ml}`}</td><td>{p.name ?? p.flavor_name}</td><td>{p.size_ml} ml</td><td>{p.units_per_carton} db</td><td>{money(p.net_unit_price_huf)}</td><td>{money(p.purchase_unit_price_huf)}</td><td>{p.minimum_stock_units} db</td><td><StatusBadge value={p.status} label={p.status} /></td></tr>)}
      </tbody></table></div>
    </div>
  );
}
