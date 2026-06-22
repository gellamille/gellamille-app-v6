import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";

const componentSchema = z.object({
  materialId: z.number().int().positive(),
  quantity: z.number().positive().max(999999),
  unitId: z.number().int().positive()
});

const nutritionSchema = z.object({
  caloriesKcal: z.number().min(0).max(9999).default(0),
  fatG: z.number().min(0).max(999).default(0),
  saturatedFatG: z.number().min(0).max(999).default(0),
  carbohydrateG: z.number().min(0).max(999).default(0),
  sugarsG: z.number().min(0).max(999).default(0),
  proteinG: z.number().min(0).max(999).default(0),
  saltG: z.number().min(0).max(999).default(0)
});

const schema = z.object({
  productId: z.number().int().positive(),
  outputUnits: z.number().int().min(1).max(999999).default(1),
  status: z.enum(["draft", "active"]).default("draft"),
  effectiveFrom: z.string().optional(),
  components: z.array(componentSchema).min(1).max(60),
  nutrition: nutritionSchema.default({})
});

function assertNoDuplicateComponents(components: z.infer<typeof componentSchema>[]) {
  const seen = new Set<number>();
  for (const component of components) {
    if (seen.has(component.materialId)) throw new Error("Egy alapanyag csak egyszer szerepelhet egy receptverzióban.");
    seen.add(component.materialId);
  }
}

export async function POST(request: Request) {
  const auth = await apiUser(["admin", "management", "production"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = schema.parse(await request.json());
    assertNoDuplicateComponents(input.components);

    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);

      const productResult = await client.query<any>(`
        select id,name,sku,flavor_code,size_ml
          from public.products
         where id=$1 and organization_id=$2 and archived_at is null
      `, [input.productId, user.organization_id]);
      const product = productResult.rows[0];
      if (!product) throw new Error("A termék nem található.");

      const materialIds = input.components.map((component) => component.materialId);
      const unitIds = input.components.map((component) => component.unitId);
      const materials = await client.query<any>(`
        select id from public.materials
         where organization_id=$1 and archived_at is null and active=true and id=any($2::bigint[])
      `, [user.organization_id, materialIds]);
      if (materials.rows.length !== new Set(materialIds).size) throw new Error("A receptben szereplő alapanyag nem található vagy inaktív.");

      const units = await client.query<any>(`
        select id,code from public.units
         where id=any($1::bigint[]) and code in ('g','ml')
      `, [unitIds]);
      if (units.rows.length !== new Set(unitIds).size) throw new Error("A receptben csak gramm vagy ml egység használható.");

      let recipe = (await client.query<any>(`
        select *
          from public.recipes
         where organization_id=$1 and product_id=$2 and active=true
         order by id
         limit 1
      `, [user.organization_id, input.productId])).rows[0];

      if (!recipe) {
        const created = await client.query<any>(`
          insert into public.recipes(organization_id,product_id,name,active)
          values($1,$2,$3,true)
          returning *
        `, [user.organization_id, input.productId, `${product.name ?? product.sku ?? product.flavor_code} receptúra`]);
        recipe = created.rows[0];
      }

      const previousActive = input.status === "active"
        ? await client.query<any>(`
            update public.recipe_versions
               set status='retired',
                   effective_to=coalesce(effective_to, coalesce($2::date,current_date))
             where recipe_id=$1 and status='active'
             returning *
          `, [recipe.id, input.effectiveFrom || null])
        : { rows: [] };

      const versionResult = await client.query<any>(`
        insert into public.recipe_versions(
          recipe_id,version_no,status,effective_from,output_units,created_by,
          nutrition_calories_kcal_per_100g,nutrition_fat_g_per_100g,nutrition_saturated_fat_g_per_100g,
          nutrition_carbohydrate_g_per_100g,nutrition_sugars_g_per_100g,nutrition_protein_g_per_100g,nutrition_salt_g_per_100g
        )
        values(
          $1,
          coalesce((select max(version_no)+1 from public.recipe_versions where recipe_id=$1),1),
          $2,$3::date,$4,$5,
          $6,$7,$8,$9,$10,$11,$12
        )
        returning *
      `, [
        recipe.id, input.status, input.effectiveFrom || null, input.outputUnits, user.user_id,
        input.nutrition.caloriesKcal, input.nutrition.fatG, input.nutrition.saturatedFatG,
        input.nutrition.carbohydrateG, input.nutrition.sugarsG, input.nutrition.proteinG, input.nutrition.saltG
      ]);
      const version = versionResult.rows[0];

      const insertedComponents = [];
      for (const component of input.components) {
        const inserted = await client.query<any>(`
          insert into public.recipe_components(recipe_version_id,material_id,quantity,unit_id)
          values($1,$2,$3,$4)
          returning *
        `, [version.id, component.materialId, component.quantity, component.unitId]);
        insertedComponents.push(inserted.rows[0]);
      }

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,'recipe.version.created','recipe',$2,$3::jsonb)
      `, [user.user_id, String(recipe.id), JSON.stringify({
        product_id: product.id,
        retired_versions: previousActive.rows,
        version,
        components: insertedComponents
      })]);
      await client.query(`
        insert into public.notifications(organization_id,role_code,type,title,body,entity_type,entity_id)
        values($1,null,'recipe.version.created','Receptúra módosítva',$2,'recipe',$3)
      `, [user.organization_id, `${product.name ?? product.sku}: v${version.version_no}`, String(recipe.id)]);

      return { recipe, version, components: insertedComponents };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiError(error, "A receptúra mentése sikertelen.");
  }
}
