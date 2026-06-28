import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";

const schema = z.object({
  plannedDate: z.string().date(),
  driverName: z.string().min(2).max(200),
  vehicle: z.string().max(120).optional().default(""),
  note: z.string().max(1000).optional().default(""),
  status: z.enum(["planned", "loading", "in_transit", "completed", "cancelled"]),
  deliveryUpdates: z.array(z.object({
    deliveryId: z.number().int().positive(),
    sequenceNo: z.number().int().positive(),
    status: z.enum(["planned", "picking", "loaded", "in_transit", "cancelled"])
  })).optional().default([]),
  removeDeliveryIds: z.array(z.number().int().positive()).optional().default([]),
  addOrderIds: z.array(z.number().int().positive()).optional().default([])
});

const ROLES = ["admin", "management", "warehouse", "sales"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await apiUser(ROLES);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = schema.parse(await request.json());
    const { id } = await params;
    const runId = Number(id);
    if (!Number.isInteger(runId) || runId <= 0) throw new Error("Hibás járatazonosító.");

    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);
      const before = await client.query<any>(`select * from public.shipping_runs where id=$1 and archived_at is null for update`, [runId]);
      const current = before.rows[0];
      if (!current || current.organization_id !== user.organization_id) throw new Error("A szállítási járat nem található.");

      const updated = await client.query<any>(`
        update public.shipping_runs
           set planned_date=$2,status=$3,driver_name=$4,vehicle=$5,note=$6
         where id=$1
         returning *
      `, [runId, input.plannedDate, input.status, input.driverName.trim(), input.vehicle || null, input.note || null]);

      await client.query(`
        update public.deliveries
           set planned_date=$2,
               status=case
                 when $3='loading' and status='planned' then 'picking'
                 when $3='in_transit' and status in ('planned','picking','loaded') then 'in_transit'
                 when $3='cancelled' and status not in ('delivered','cancelled') then 'cancelled'
                 else status
               end
         where shipping_run_id=$1 and status not in ('delivered','cancelled') and archived_at is null
      `, [runId, input.plannedDate, input.status]);

      if (input.removeDeliveryIds.length) {
        await client.query(`
          update public.deliveries d
             set shipping_run_id=null,
                 sequence_no=null,
                 planned_date=coalesce(o.requested_delivery_date, $3::date),
                 status=case when d.status in ('delivered','cancelled') then d.status else 'planned' end
            from public.orders o
           where d.order_id=o.id
             and d.id = any($1::bigint[])
             and d.shipping_run_id=$2
             and d.organization_id=$4
             and d.archived_at is null
             and d.status not in ('delivered','cancelled')
        `, [input.removeDeliveryIds, runId, input.plannedDate, user.organization_id]);
      }

      for (const delivery of input.deliveryUpdates) {
        await client.query(`
          update public.deliveries
             set sequence_no=$2,
                 status=$3,
                 planned_date=$4
           where id=$1
             and shipping_run_id=$5
             and organization_id=$6
             and archived_at is null
             and status not in ('delivered','cancelled')
        `, [delivery.deliveryId, delivery.sequenceNo, delivery.status, input.plannedDate, runId, user.organization_id]);
      }

      if (input.addOrderIds.length) {
        const maxSequence = await client.query<{ max_sequence: number | null }>(`
          select max(sequence_no)::int as max_sequence
            from public.deliveries
           where shipping_run_id=$1 and archived_at is null and status not in ('delivered','cancelled')
        `, [runId]);
        let nextSequence = (maxSequence.rows[0]?.max_sequence ?? 0) + 1;

        for (const orderId of [...new Set(input.addOrderIds)]) {
          const orderResult = await client.query<any>(`
            select id,organization_id,partner_id,delivery_address_id,status,fulfillment_status
              from public.orders where id=$1 and archived_at is null for update
          `, [orderId]);
          const order = orderResult.rows[0];
          if (!order || order.organization_id !== user.organization_id) throw new Error(`A rendelés nem található: ${orderId}`);
          if (!["approved", "partially_approved"].includes(order.status)) {
            throw new Error("Csak elfogadott rendelés tehető szállítási járatba.");
          }
          if (!["reserved", "partially_reserved", "picking", "packed", "partially_delivered"].includes(order.fulfillment_status)) {
            throw new Error("Csak foglalt vagy összekészített rendelés tehető szállítási járatba.");
          }
          const delivered = await client.query(`select 1 from public.deliveries where order_id=$1 and status='delivered' and archived_at is null limit 1`, [order.id]);
          if (delivered.rowCount) throw new Error("Már átadott rendelés nem tehető új szállítási járatba.");

          const existing = await client.query<any>(`
            select id from public.deliveries
             where order_id=$1 and organization_id=$2 and status not in ('delivered','cancelled')
               and archived_at is null
             order by created_at desc limit 1 for update
          `, [order.id, user.organization_id]);

          if (existing.rows[0]) {
            await client.query(`
              update public.deliveries
                 set shipping_run_id=$2,planned_date=$3,sequence_no=$4,
                     partner_id=$5,address_id=$6,status='planned'
               where id=$1
            `, [existing.rows[0].id, runId, input.plannedDate, nextSequence, order.partner_id, order.delivery_address_id]);
          } else {
            await client.query(`
              insert into public.deliveries(
                organization_id,shipping_run_id,order_id,partner_id,address_id,planned_date,sequence_no,status,created_by
              ) values($1,$2,$3,$4,$5,$6,$7,'planned',$8)
            `, [user.organization_id, runId, order.id, order.partner_id, order.delivery_address_id, input.plannedDate, nextSequence, user.user_id]);
          }
          nextSequence += 1;
        }
      }

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,'shipping_run.updated','shipping_run',$2,$3::jsonb)
      `, [user.user_id, String(runId), JSON.stringify({
        before: current,
        after: updated.rows[0],
        deliveryUpdates: input.deliveryUpdates,
        removeDeliveryIds: input.removeDeliveryIds,
        addOrderIds: input.addOrderIds
      })]);
      await client.query(`
        insert into public.notifications(organization_id,role_code,type,title,body,entity_type,entity_id)
        values($1,null,'shipping_run.updated','Szállítási járat módosítva',$2,'shipping_run',$3)
      `, [user.organization_id, `${updated.rows[0].run_number}: ${input.driverName.trim()} · ${input.status}`, String(runId)]);

      return updated.rows[0];
    });

    return NextResponse.json(result);
  } catch (error) {
    return apiError(error, "A szállítási járat módosítása sikertelen.");
  }
}
