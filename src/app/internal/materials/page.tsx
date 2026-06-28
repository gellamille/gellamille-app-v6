import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { requireAppUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { money } from "@/lib/format";
import { huLabel, recipeStatusLabels } from "@/lib/status";
import { MaterialRecipeManager } from "./MaterialRecipeManager";

const categoryLabels: Record<string, string> = {
  ingredient: "Alapanyag",
  packaging: "Csomagolóanyag",
  label: "Címke",
  lid: "Tető",
  container: "Doboz",
  auxiliary: "Segédanyag",
};

export default async function MaterialsPage() {
  const user = await requireAppUser(["admin", "management", "staff", "production", "warehouse"]);
  const canWrite = ["admin", "management", "production", "warehouse"].includes(user.role);

  const materials = await query<any>(`
    select m.*, u.code as unit_code, coalesce(v.stock_quantity,0) as stock_quantity
      from public.materials m
      join public.units u on u.id=m.base_unit_id
      left join public.v_material_stock v on v.material_id=m.id
     where m.archived_at is null
     order by m.category, m.name
  `);
  const units = await query<any>(`select id,code,name from public.units order by case code when 'g' then 1 when 'ml' then 2 else 9 end, code`);
  const recipeUnits = units.filter((unit) => ["g", "ml"].includes(unit.code));
  const products = await query<any>(`
    select p.id,p.name,p.sku,p.size_ml,f.name as flavor_name
      from public.products p
      join public.flavors f on f.code=p.flavor_code
     where p.active=true and p.archived_at is null
     order by p.size_ml,p.sort_order,p.name
  `);
  const recipes = await query<any>(`
    select rv.id, p.name as product_name, p.size_ml, rv.version_no, rv.status, rv.effective_from,
           rv.nutrition_calories_kcal_per_100g,
           rv.nutrition_fat_g_per_100g,
           rv.nutrition_carbohydrate_g_per_100g,
           rv.nutrition_protein_g_per_100g,
           count(rc.id)::int as component_count,
           string_agg(m.name || ' ' || trim(to_char(rc.quantity,'FM999999990.###')) || ' ' || u.code, ', ' order by m.name) as components
      from public.recipe_versions rv
      join public.recipes r on r.id=rv.recipe_id
      join public.products p on p.id=r.product_id
      left join public.recipe_components rc on rc.recipe_version_id=rv.id
      left join public.materials m on m.id=rc.material_id
      left join public.units u on u.id=rc.unit_id
     group by rv.id,p.name,p.size_ml
     order by p.name,p.size_ml,rv.version_no desc
  `);
  return (
    <div className="page">
      <PageHeader title="Alapanyagok és receptek" description="Alapanyag törzs és verziózott receptúra. A recept módosítása új verzióként, auditnaplóval mentődik." />
      <MaterialRecipeManager
        products={products}
        materials={materials.map((material) => ({ id: material.id, name: material.name, code: material.code }))}
        units={units}
        recipeUnits={recipeUnits}
        canWrite={canWrite}
      />
      <section className="grid grid-2">
        <div>
          <h2>Alapanyagok és csomagolóanyagok</h2>
          <div className="table-wrap"><table><thead><tr><th>Név</th><th>Kategória</th><th>Készlet</th><th>Minimum</th><th>Egységköltség</th><th>Állapot</th></tr></thead><tbody>
            {materials.map(m => <tr key={m.id}><td>{m.name}<div className="mono text-muted">{m.code}</div></td><td>{categoryLabels[m.category] ?? m.category}</td><td>{m.stock_quantity} {m.unit_code}</td><td>{m.minimum_stock_quantity} {m.unit_code}</td><td>{money(m.current_unit_cost_huf)}</td><td><StatusBadge value={m.active ? "active" : "cancelled"} label={m.active ? "Aktív" : "Inaktív"} /></td></tr>)}
            {!materials.length ? <tr><td colSpan={6}>Még nincs rögzített alapanyag.</td></tr> : null}
          </tbody></table></div>
        </div>
        <div>
          <h2>Receptverziók</h2>
          <div className="table-wrap"><table><thead><tr><th>Termék</th><th>Verzió</th><th>Összetevők</th><th>Tápérték / 100 g</th><th>Érvényes</th><th>Állapot</th></tr></thead><tbody>
            {recipes.map(r => <tr key={r.id}><td>{r.product_name} · {r.size_ml} ml</td><td>v{r.version_no}</td><td>{r.components ?? `${r.component_count} összetevő`}</td><td>{r.nutrition_calories_kcal_per_100g} kcal · Zsír {r.nutrition_fat_g_per_100g} g · CH {r.nutrition_carbohydrate_g_per_100g} g · Fehérje {r.nutrition_protein_g_per_100g} g</td><td>{r.effective_from ?? "—"}</td><td><StatusBadge value={r.status} label={huLabel(recipeStatusLabels, r.status)} /></td></tr>)}
            {!recipes.length ? <tr><td colSpan={6}>Még nincs rögzített recept.</td></tr> : null}
          </tbody></table></div>
        </div>
      </section>
    </div>
  );
}
