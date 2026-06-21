import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query } from "@/lib/db";

export default async function MaterialsPage() {
  const materials = await query<any>(`
    select m.*, u.code as unit_code, coalesce(v.stock_quantity,0) as stock_quantity
      from public.materials m
      join public.units u on u.id=m.base_unit_id
      left join public.v_material_stock v on v.material_id=m.id
     where m.archived_at is null
     order by m.category, m.name
  `);
  const recipes = await query<any>(`
    select rv.id, p.name as product_name, p.size_ml, rv.version_no, rv.status, rv.effective_from,
           count(rc.id)::int as component_count
      from public.recipe_versions rv
      join public.recipes r on r.id=rv.recipe_id
      join public.products p on p.id=r.product_id
      left join public.recipe_components rc on rc.recipe_version_id=rv.id
     group by rv.id,p.name,p.size_ml
     order by p.name,p.size_ml,rv.version_no desc
  `);
  return (
    <div className="page">
      <PageHeader title="Alapanyagok és receptek" description="Első körben adatbázis és minimális front. A késztermék-bevételezés ettől függetlenül működik." />
      <section className="grid grid-2">
        <div>
          <h2>Alapanyagok és csomagolóanyagok</h2>
          <div className="table-wrap"><table><thead><tr><th>Név</th><th>Kategória</th><th>Készlet</th><th>Minimum</th><th>Állapot</th></tr></thead><tbody>
            {materials.map(m => <tr key={m.id}><td>{m.name}<div className="mono text-muted">{m.code}</div></td><td>{m.category}</td><td>{m.stock_quantity} {m.unit_code}</td><td>{m.minimum_stock_quantity} {m.unit_code}</td><td><StatusBadge value={m.active ? "active" : "cancelled"} label={m.active ? "Aktív" : "Inaktív"} /></td></tr>)}
            {!materials.length ? <tr><td colSpan={5}>Az alapanyagokat később itt lehet felvinni.</td></tr> : null}
          </tbody></table></div>
        </div>
        <div>
          <h2>Receptverziók</h2>
          <div className="table-wrap"><table><thead><tr><th>Termék</th><th>Verzió</th><th>Összetevő</th><th>Érvényes</th><th>Állapot</th></tr></thead><tbody>
            {recipes.map(r => <tr key={r.id}><td>{r.product_name} · {r.size_ml} ml</td><td>v{r.version_no}</td><td>{r.component_count}</td><td>{r.effective_from ?? "—"}</td><td><StatusBadge value={r.status} label={r.status} /></td></tr>)}
            {!recipes.length ? <tr><td colSpan={5}>Még nincs rögzített recept.</td></tr> : null}
          </tbody></table></div>
        </div>
      </section>
    </div>
  );
}
