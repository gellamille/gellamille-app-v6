import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";

const schema = z.object({
  title: z.string().min(3).max(250),
  reason: z.string().min(5).max(2000),
  lotIds: z.array(z.number().int().positive()).min(1)
});

const ROLES = ["admin", "management", "warehouse", "production"];

export async function POST(request: Request) {
  const auth = await apiUser(ROLES);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = schema.parse(await request.json());
    const uniqueLotIds = [...new Set(input.lotIds)];
    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);

      const recallResult = await client.query<any>(`
        insert into public.product_recalls(organization_id,title,reason,status,created_by)
        values($1,$2,$3,'open',$4)
        returning *
      `, [user.organization_id, input.title.trim(), input.reason.trim(), user.user_id]);
      const recall = recallResult.rows[0];

      const scrapLocation = await client.query<{ id: number }>(`
        select id from public.inventory_locations
         where organization_id=$1 and code='SCRAP' and active=true
      `, [user.organization_id]);
      if (!scrapLocation.rows[0]) throw new Error("A Selejt készlethely nincs beállítva.");

      const recalledLots = [];
      for (const lotId of uniqueLotIds) {
        const lotResult = await client.query<any>(`
          select l.*,p.id as product_id,p.name as product_name
           from public.lots l
           join public.products p on p.flavor_code=l.flavor_code and p.size_ml=l.size_ml and p.organization_id=l.organization_id
           where l.id=$1 and l.organization_id=$2
           for update
        `, [lotId, user.organization_id]);
        const lot = lotResult.rows[0];
        if (!lot) throw new Error(`A LOT nem található: ${lotId}`);
        if (["void", "scrapped"].includes(lot.status)) throw new Error(`${lot.lot_number}: sztornózott vagy selejtezett LOT nem hívható vissza.`);

        await client.query(`
          insert into public.product_recall_lots(recall_id,lot_id)
          values($1,$2)
          on conflict do nothing
        `, [recall.id, lot.id]);

        const balances = await client.query<any>(`
          select im.location_id,loc.code,coalesce(sum(im.quantity_units),0)::int as balance
            from public.inventory_movements im
            join public.inventory_locations loc on loc.id=im.location_id
           where im.lot_id=$1 and im.organization_id=$2 and im.archived_at is null and loc.code<>'SCRAP'
           group by im.location_id,loc.code
          having coalesce(sum(im.quantity_units),0)>0
        `, [lot.id, user.organization_id]);
        for (const balance of balances.rows) {
          await client.query(`
            insert into public.inventory_movements(organization_id,product_id,lot_id,location_id,movement_type,quantity_units,unit_cost_huf,reason,created_by)
            values($1,$2,$3,$4,'recall',$5,$6,$7,$8)
          `, [user.organization_id, lot.product_id, lot.id, balance.location_id, -Number(balance.balance), lot.purchase_unit_price_huf ?? 0, input.reason.trim(), user.user_id]);
          await client.query(`
            insert into public.inventory_movements(organization_id,product_id,lot_id,location_id,movement_type,quantity_units,unit_cost_huf,reason,created_by)
            values($1,$2,$3,$4,'recall',$5,$6,$7,$8)
          `, [user.organization_id, lot.product_id, lot.id, scrapLocation.rows[0].id, Number(balance.balance), lot.purchase_unit_price_huf ?? 0, input.reason.trim(), user.user_id]);
        }
        recalledLots.push({ id: lot.id, lot_number: lot.lot_number, product_name: lot.product_name });
      }

      const affectedPartners = await client.query<any>(`
        select p.id,p.name,p.email,array_agg(distinct l.lot_number order by l.lot_number) as lot_numbers,
               array_agg(distinct o.order_number order by o.order_number) as order_numbers
          from public.order_item_lot_allocations a
          join public.lots l on l.id=a.lot_id
          join public.order_items oi on oi.id=a.order_item_id
          join public.orders o on o.id=oi.order_id
          join public.partners p on p.id=o.partner_id
         where a.lot_id = any($1::bigint[]) and a.status='delivered'
           and o.organization_id=$2
           and o.archived_at is null
         group by p.id,p.name,p.email
      `, [uniqueLotIds, user.organization_id]);
      for (const partner of affectedPartners.rows) {
        if (!partner.email) continue;
        await client.query(`
          insert into public.email_outbox(organization_id,event_type,recipient_email,subject,body_text,payload)
          values($1,'product_recall',$2,$3,$4,$5::jsonb)
        `, [
          user.organization_id,
          partner.email,
          `Gellamille termékvisszahívás - ${input.title.trim()}`,
          `Kedves ${partner.name}!\n\nTermékvisszahívás érinti az alábbi LOT számú termékeket: ${partner.lot_numbers.join(", ")}.\nÉrintett rendelések: ${partner.order_numbers.join(", ")}.\n\nOk: ${input.reason.trim()}\n\nKérjük, vedd fel velünk a kapcsolatot a további egyeztetéshez.`,
          JSON.stringify({ recall_id: recall.id, partner_id: partner.id, lot_numbers: partner.lot_numbers, order_numbers: partner.order_numbers })
        ]);
      }

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,'product_recall.created','product_recall',$2,$3::jsonb)
      `, [user.user_id, String(recall.id), JSON.stringify({ recall, lots: recalledLots, affected_partners: affectedPartners.rows.length })]);
      await client.query(`
        insert into public.notifications(organization_id,role_code,type,title,body,entity_type,entity_id)
        values($1,null,'product_recall.created','Termékvisszahívás indult',$2,'product_recall',$3)
      `, [user.organization_id, `${input.title.trim()} · ${recalledLots.length} LOT · ${affectedPartners.rows.length} érintett partner`, String(recall.id)]);

      return { recall, lots: recalledLots, affectedPartners: affectedPartners.rows.length };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiError(error, "A visszahívás létrehozása sikertelen.");
  }
}
