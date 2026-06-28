import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { query, transaction } from "@/lib/db";

const createLotSchema = z.object({
  productId: z.number().int().positive(),
  productionDate: z.string().date(),
  productionPeriod: z.enum(["AM", "PM"]),
  quantity: z.number().int().positive(),
  operatorId: z.number().int().positive(),
  note: z.string().max(1000).optional().default(""),
  purchaseUnitPriceHuf: z.number().int().min(0).optional().default(0)
});

const LOT_ROLES = ["admin", "management", "production"];

export async function GET() {
  const auth = await apiUser(["admin", "management", "staff", "production", "warehouse"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;
  const rows = await query(`
    select l.*, p.id as product_id, p.name as product_name, p.sku
      from public.lots l
      join public.products p on p.flavor_code=l.flavor_code and p.size_ml=l.size_ml
     where l.organization_id=$1
       and l.archived_at is null
     order by l.created_at desc limit 500
  `, [user.organization_id]);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const auth = await apiUser(LOT_ROLES);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = createLotSchema.parse(await request.json());
    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);

      const productResult = await client.query<{
        id: number; flavor_code: string; size_ml: number; purchase_unit_price_huf: number;
        units_per_carton: number; organization_id: number; active: boolean; status: string;
      }>(`
        select id,flavor_code,size_ml,purchase_unit_price_huf,units_per_carton,organization_id,active,status
          from public.products where id=$1 for update
      `, [input.productId]);
      const product = productResult.rows[0];
      if (!product || !product.active || !["active", "seasonal"].includes(product.status)) {
        throw new Error("A kiválasztott termék nem aktív.");
      }
      if (product.organization_id !== user.organization_id) {
        throw new Error("A termék másik szervezethez tartozik.");
      }
      const unitsPerCarton = Number(product.units_per_carton ?? 0);
      if (!Number.isInteger(unitsPerCarton) || unitsPerCarton <= 0) {
        throw new Error("A termék karton kiszerelése nincs beállítva.");
      }

      const operatorResult = await client.query(`select id from public.operators where id=$1 and active=true`, [input.operatorId]);
      if (!operatorResult.rowCount) throw new Error("A felelős személy nem található vagy inaktív.");

      const lotResult = await client.query<any>(`
        select * from public.create_gellamille_lot($1::date,$2::text,$3::text,$4::smallint,$5::integer,$6::bigint,$7::text)
      `, [input.productionDate, input.productionPeriod, product.flavor_code, product.size_ml, input.quantity, input.operatorId, input.note || null]);
      const lot = lotResult.rows[0];
      if (!lot) throw new Error("A LOT létrehozása nem adott vissza eredményt.");

      const purchasePrice = input.purchaseUnitPriceHuf || product.purchase_unit_price_huf || 0;
      await client.query(`
        update public.lots
           set organization_id=$1,purchase_unit_price_huf=$2
         where id=$3
      `, [user.organization_id, purchasePrice, lot.id]);

      const locationResult = await client.query<{ id: number }>(`
        select id from public.inventory_locations
         where organization_id=$1 and code='CENTRAL' and active=true
      `, [user.organization_id]);
      const location = locationResult.rows[0];
      if (!location) throw new Error("A Központi raktár nincs beállítva.");

      await client.query(`
        insert into public.inventory_movements(
          organization_id,product_id,lot_id,location_id,movement_type,
          quantity_units,unit_cost_huf,reason,created_by
        ) values($1,$2,$3,$4,'production_receipt',$5,$6,$7,$8)
      `, [user.organization_id, product.id, lot.id, location.id, input.quantity, purchasePrice, "LOT létrehozás és automatikus készletre vétel", user.user_id]);

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,'lot.created_and_received','lot',$2,$3::jsonb)
      `, [user.user_id, String(lot.id), JSON.stringify({
        lot_number: lot.lot_number,
        quantity: input.quantity,
        product_id: product.id,
        purchase_unit_price_huf: purchasePrice,
        units_per_carton: unitsPerCarton,
        carton_count: 0,
        carton_flow: "cartons_are_created_during_label_generation"
      })]);

      return {
        ...lot,
        purchase_unit_price_huf: purchasePrice,
        product_id: product.id,
        units_per_carton: unitsPerCarton,
        carton_count: 0,
        first_carton_code: null,
        last_carton_code: null
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiError(error, "A LOT létrehozása sikertelen.");
  }
}
