import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { one, transaction } from "@/lib/db";
import { apiError } from "@/lib/http";
import { supportTablesReady } from "@/lib/support";
import { enforceRateLimits, RATE_LIMITS, rateLimitOption, requestIp } from "@/lib/rate-limit";

const messageSchema = z.object({
  body: z.string().trim().min(1, "Az üzenet nem lehet üres.").max(3000)
});

const internalRoles = ["admin", "management", "staff", "sales", "finance"] as const;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await apiUser(["partner", ...internalRoles]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;
  if (user.role === "partner") {
    const limited = await enforceRateLimits([
      rateLimitOption(RATE_LIMITS.partnerApiIp, requestIp(request)),
      rateLimitOption(RATE_LIMITS.partnerTicketMessage, String(user.partner_id ?? user.user_id))
    ]);
    if (limited) return limited;
  }

  try {
    const { id } = await params;
    const ticketId = Number(id);
    if (!Number.isInteger(ticketId) || ticketId < 1) throw new Error("Érvénytelen ticket azonosító.");
    if (!(await supportTablesReady())) throw new Error("Az ügyfélszolgálati ticket modul adatbázis migrációja még nincs alkalmazva.");
    const input = messageSchema.parse(await request.json());

    const ticket = await one<any>(`
      select st.*, p.name as partner_name
        from public.support_tickets st
        join public.partners p on p.id=st.partner_id
       where st.id=$1 and st.organization_id=$2
         and ($3::boolean=false or st.partner_id=$4)
         and st.archived_at is null
    `, [ticketId, user.organization_id, user.role === "partner", user.partner_id ?? null]);
    if (!ticket) throw new Error("A ticket nem található.");
    if (ticket.status === "closed" || ticket.status === "cancelled") {
      throw new Error("Lezárt vagy törölt tickethez már nem írható új üzenet.");
    }

    const result = await transaction(async (client) => {
      const message = await client.query<any>(`
        insert into public.support_ticket_messages(
          organization_id,ticket_id,sender_user_id,sender_role,body
        ) values($1,$2,$3,$4,$5)
        returning *
      `, [user.organization_id, ticketId, user.user_id, user.role === "partner" ? "partner" : "internal", input.body]);

      if (user.role !== "partner") {
        await client.query(`
          insert into public.notifications(organization_id,user_id,type,title,body,entity_type,entity_id)
          select $1,au.user_id,'partner.support.reply','Válasz érkezett az ügyfélszolgálati ticketre',$2,'support_ticket',$3
            from public.app_users au
           where au.role='partner' and au.partner_id=$4 and au.active=true
        `, [user.organization_id, String(ticket.subject), String(ticketId), ticket.partner_id]);
      } else {
        await client.query(`
          insert into public.notifications(organization_id,role_code,type,title,body,entity_type,entity_id)
          values($1,'admin','partner.support.message','Új partneri üzenet érkezett',$2,'support_ticket',$3)
        `, [user.organization_id, `${ticket.partner_name}: ${ticket.subject}`, String(ticketId)]);
      }

      return message.rows[0];
    });

    return NextResponse.json({ message: result }, { status: 201 });
  } catch (error) {
    return apiError(error, "Az üzenet mentése sikertelen.", { route: "/api/support/tickets/[id]/messages", userId: user.user_id, role: user.role });
  }
}
