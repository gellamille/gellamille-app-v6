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
  status: z.enum(["planned", "loading", "in_transit", "completed", "cancelled"])
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

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,'shipping_run.updated','shipping_run',$2,$3::jsonb)
      `, [user.user_id, String(runId), JSON.stringify({ before: current, after: updated.rows[0] })]);
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
