import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";

const schema=z.object({
  lotId:z.number().int().positive(),locationId:z.number().int().positive(),
  movementType:z.enum(["correction","sample","marketing","tasting","internal_use","damage","scrap"]),
  quantityUnits:z.number().int().refine((value)=>value!==0,{message:'Quantity cannot be zero'}),reason:z.string().min(5).max(1000)
});
const consumption=new Set(["sample","marketing","tasting","internal_use","damage","scrap"]);

export async function POST(request:Request){
 const auth=await apiUser(["admin","management","warehouse"]);
 if(auth.error||!auth.user)return auth.error??NextResponse.json({error:"Nincs jogosultság."},{status:401});
 const user=auth.user;
 try{
  const input=schema.parse(await request.json());
  const result=await transaction(async client=>{
   await client.query(`select set_config('request.jwt.claim.sub',$1,true)`,[user.user_id]);
   const lotResult=await client.query<any>(`
    select l.*,p.id product_id,p.name product_name from public.lots l
    join public.products p on p.flavor_code=l.flavor_code and p.size_ml=l.size_ml and p.organization_id=l.organization_id
    where l.id=$1 for update
   `,[input.lotId]);
   const lot=lotResult.rows[0];
   if(!lot||lot.organization_id!==user.organization_id)throw new Error("A LOT nem található.");
   if(lot.status!=="active")throw new Error("Csak aktív LOT készlete korrigálható.");
   const loc=await client.query(`select 1 from public.inventory_locations where id=$1 and organization_id=$2 and active`,[input.locationId,user.organization_id]);
   if(!loc.rowCount)throw new Error("A készlethely nem található.");
   let quantity=input.quantityUnits;
   if(consumption.has(input.movementType)) quantity=-Math.abs(quantity);
   if(input.movementType!=="correction"&&input.quantityUnits<0) quantity=-Math.abs(input.quantityUnits);
   const movement=await client.query<any>(`
    insert into public.inventory_movements(
     organization_id,product_id,lot_id,location_id,movement_type,quantity_units,unit_cost_huf,reason,created_by
    ) values($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *
   `,[user.organization_id,lot.product_id,lot.id,input.locationId,input.movementType,quantity,lot.purchase_unit_price_huf,input.reason.trim(),user.user_id]);
   const balance=await client.query<{value:number}>(`select coalesce(sum(quantity_units),0)::int value from public.inventory_movements where lot_id=$1 and archived_at is null`,[lot.id]);
   if(Number(balance.rows[0]?.value??0)===0)await client.query(`update public.lots set status='depleted' where id=$1 and status='active'`,[lot.id]);
   await client.query(`insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data) values($1,'inventory.adjusted','lot',$2,$3::jsonb)`,[user.user_id,String(lot.id),JSON.stringify(movement.rows[0])]);
   return movement.rows[0];
  });
  return NextResponse.json(result,{status:201});
 }catch(error){return apiError(error,"A készletkorrekció sikertelen.");}
}
