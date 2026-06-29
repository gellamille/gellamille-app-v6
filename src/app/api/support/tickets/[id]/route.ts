import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { one, query } from "@/lib/db";
import { apiError } from "@/lib/http";
import { supportTablesReady } from "@/lib/support";

const updateSchema = z.object({
  status: z.enum(["open", "in_progress", "waiting_partner", "closed", "cancelled"]).optional(),
  assignedTo: z.string().uuid().nullable().optional()
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await apiUser(["admin", "management", "staff", "sales"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const { id } = await params;
    const ticketId = Number(id);
    if (!Number.isInteger(ticketId) || ticketId < 1) throw new Error("Érvénytelen ticket azonosító.");
    if (!(await supportTablesReady())) throw new Error("Az ügyfélszolgálati ticket modul adatbázis migrációja még nincs alkalmazva.");
    const input = updateSchema.parse(await request.json());

    const ticket = await one<any>(`select * from public.support_tickets where id=$1 and archived_at is null`, [ticketId]);
    if (!ticket || ticket.organization_id !== user.organization_id) throw new Error("A ticket nem található.");

    const rows = await query<any>(`
      update public.support_tickets
         set status=coalesce($3,status),
             assigned_to=case when $4::boolean then $5::uuid else assigned_to end,
             closed_at=case when $3='closed' then now() when $3 is not null and $3<>'closed' then null else closed_at end
       where id=$1 and organization_id=$2
       returning *
    `, [ticketId, user.organization_id, input.status ?? null, Object.prototype.hasOwnProperty.call(input, "assignedTo"), input.assignedTo ?? null]);

    await query(`
      insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
      values($1,'support_ticket.updated','support_ticket',$2,$3::jsonb)
    `, [user.user_id, String(ticketId), JSON.stringify(input)]);

    return NextResponse.json({ ticket: rows[0] });
  } catch (error) {
    return apiError(error, "A ticket frissítése sikertelen.");
  }
}
