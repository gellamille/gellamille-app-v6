import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2).max(250),
  unitsPerCarton: z.number().int().min(1).max(999),
  netUnitPriceHuf: z.number().int().positive(),
  purchaseUnitPriceHuf: z.number().int().min(0),
  minimumStockUnits: z.number().int().min(0),
  status: z.enum(["active", "temporarily_unavailable", "seasonal", "phasing_out", "discontinued"]),
  active: z.boolean().default(true)
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await apiUser(["admin", "management", "production", "sales"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = schema.parse(await request.json());
    const { id } = await params;
    const productId = Number(id);
    if (!Number.isInteger(productId) || productId <= 0) throw new Error("Hibás termékazonosító.");

    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);
      const before = await client.query<any>(`select * from public.products where id=$1 for update`, [productId]);
      const product = before.rows[0];
      if (!product || product.organization_id !== user.organization_id) throw new Error("A termék nem található.");

      const updated = await client.query(`
        update public.products set
          name=$2,
          units_per_carton=$3,
          net_unit_price_huf=$4,
          purchase_unit_price_huf=$5,
          minimum_stock_units=$6,
          status=$7,
          active=$8
        where id=$1 and organization_id=$9
        returning *
      `, [productId, input.name.trim(), input.unitsPerCarton, input.netUnitPriceHuf, input.purchaseUnitPriceHuf,
        input.minimumStockUnits, input.status, input.active, user.organization_id]);

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,'product.updated','product',$2,$3::jsonb)
      `, [user.user_id, String(productId), JSON.stringify({ before: product, after: updated.rows[0] })]);
      await client.query(`
        insert into public.notifications(organization_id,role_code,type,title,body,entity_type,entity_id)
        values($1,null,'product.updated','Termék módosítva',$2,'product',$3)
      `, [user.organization_id, input.name.trim(), String(productId)]);

      return updated.rows[0];
    });

    return NextResponse.json(result);
  } catch (error) {
    return apiError(error, "A termék mentése sikertelen.");
  }
}
