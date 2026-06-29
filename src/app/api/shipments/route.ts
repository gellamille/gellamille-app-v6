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
  orderIds: z.array(z.number().int().positive()).min(1)
});

const ROLES = ["admin", "management", "warehouse", "sales"];

export async function POST(request: Request) {
  const auth = await apiUser(ROLES);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = schema.parse(await request.json());
    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);

      const runResult = await client.query<any>(`
        insert into public.shipping_runs(
          organization_id,planned_date,status,driver_name,vehicle,note,created_by
        ) values($1,$2,'planned',$3,$4,$5,$6)
        returning *
      `, [user.organization_id, input.plannedDate, input.driverName.trim(), input.vehicle || null, input.note || null, user.user_id]);
      const run = runResult.rows[0];

      const deliveries: unknown[] = [];
      for (const [index, orderId] of input.orderIds.entries()) {
        const orderResult = await client.query<any>(`
          select id,organization_id,partner_id,delivery_address_id,status,fulfillment_status
            from public.orders
           where id=$1 and organization_id=$2 and archived_at is null
           for update
        `, [orderId, user.organization_id]);
        const order = orderResult.rows[0];
        if (!order) throw new Error(`A rendelés nem található: ${orderId}`);
        if (!["approved", "partially_approved"].includes(order.status)) {
          throw new Error("Csak elfogadott rendelés tehető szállítási járatba.");
        }
        if (!["reserved", "partially_reserved", "picking", "packed", "partially_delivered"].includes(order.fulfillment_status)) {
          throw new Error("Csak foglalt vagy összekészített rendelés tehető szállítási járatba.");
        }
        const delivered = await client.query(`select 1 from public.deliveries where order_id=$1 and organization_id=$2 and status='delivered' and archived_at is null limit 1`, [order.id, user.organization_id]);
        if (delivered.rowCount) throw new Error("Már átadott rendelés nem tehető új szállítási járatba.");

        const existing = await client.query<any>(`
          select id from public.deliveries
           where order_id=$1 and organization_id=$2 and status not in ('delivered','cancelled')
             and archived_at is null
           order by created_at desc limit 1 for update
        `, [order.id, user.organization_id]);

        const deliveryResult = existing.rows[0]
          ? await client.query<any>(`
              update public.deliveries
                 set shipping_run_id=$2,planned_date=$3,sequence_no=$4,
                     partner_id=$5,address_id=$6,status='planned'
               where id=$1 and organization_id=$7
               returning *
            `, [existing.rows[0].id, run.id, input.plannedDate, index + 1, order.partner_id, order.delivery_address_id, user.organization_id])
          : await client.query<any>(`
              insert into public.deliveries(
                organization_id,shipping_run_id,order_id,partner_id,address_id,planned_date,sequence_no,status,created_by
              ) values($1,$2,$3,$4,$5,$6,$7,'planned',$8)
              returning *
            `, [user.organization_id, run.id, order.id, order.partner_id, order.delivery_address_id, input.plannedDate, index + 1, user.user_id]);
        deliveries.push(deliveryResult.rows[0]);
      }

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,'shipping_run.created','shipping_run',$2,$3::jsonb)
      `, [user.user_id, String(run.id), JSON.stringify({ run, deliveries })]);
      await client.query(`
        insert into public.notifications(organization_id,role_code,type,title,body,entity_type,entity_id)
        values($1,null,'shipping_run.created','Új szállítási járat',$2,'shipping_run',$3)
      `, [user.organization_id, `${run.run_number}: ${input.driverName.trim()} · ${input.orderIds.length} rendelés`, String(run.id)]);

      return { run, deliveries };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiError(error, "A szállítási járat létrehozása sikertelen.");
  }
}
