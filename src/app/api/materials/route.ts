import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";

const schema = z.object({
  code: z.string().trim().max(40).optional(),
  name: z.string().trim().min(2).max(200),
  category: z.enum(["ingredient", "packaging", "label", "lid", "container", "auxiliary"]),
  baseUnitId: z.number().int().positive(),
  allergenInfo: z.string().trim().max(500).optional(),
  supplierName: z.string().trim().max(200).optional(),
  minimumStockQuantity: z.number().min(0).max(999999).default(0),
  currentUnitCostHuf: z.number().min(0).max(99999999).default(0)
});

function fallbackCode(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 36)
    .toUpperCase();
}

export async function POST(request: Request) {
  const auth = await apiUser(["admin", "management", "production", "warehouse"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = schema.parse(await request.json());
    const material = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);
      const unit = await client.query(`select id from public.units where id=$1`, [input.baseUnitId]);
      if (!unit.rows.length) throw new Error("A kiválasztott egység nem található.");

      const code = (input.code?.trim() || fallbackCode(input.name) || `MAT-${Date.now()}`).toUpperCase();
      const inserted = await client.query(`
        insert into public.materials(
          organization_id,code,name,category,base_unit_id,allergen_info,supplier_name,
          minimum_stock_quantity,current_unit_cost_huf,active
        )
        values($1,$2,$3,$4,$5,$6,$7,$8,$9,true)
        returning *
      `, [
        user.organization_id, code, input.name.trim(), input.category, input.baseUnitId,
        input.allergenInfo || null, input.supplierName || null, input.minimumStockQuantity, input.currentUnitCostHuf
      ]);

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,'material.created','material',$2,$3::jsonb)
      `, [user.user_id, String(inserted.rows[0].id), JSON.stringify(inserted.rows[0])]);
      await client.query(`
        insert into public.notifications(organization_id,role_code,type,title,body,entity_type,entity_id)
        values($1,null,'material.created','Új alapanyag',$2,'material',$3)
      `, [user.organization_id, input.name.trim(), String(inserted.rows[0].id)]);

      return inserted.rows[0];
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    return apiError(error, "Az alapanyag létrehozása sikertelen.");
  }
}
