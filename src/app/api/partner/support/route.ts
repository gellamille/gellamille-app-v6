import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { transaction } from "@/lib/db";
import { apiError } from "@/lib/http";
import { supportTablesReady } from "@/lib/support";
import { enforceRateLimits, RATE_LIMITS, rateLimitOption, requestIp } from "@/lib/rate-limit";

const supportTicketSchema = z.object({
  subject: z.string().trim().min(3, "A tárgy legalább 3 karakter legyen.").max(180),
  message: z.string().trim().min(10, "Kérlek, írj legalább néhány mondatot a panaszról.").max(3000),
  orderNumber: z.string().trim().max(80).optional().default(""),
  priority: z.enum(["normal", "high", "urgent"]).default("normal")
});

export async function POST(request: Request) {
  const auth = await apiUser(["partner"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;
  const limited = await enforceRateLimits([
    rateLimitOption(RATE_LIMITS.partnerApiIp, requestIp(request)),
    rateLimitOption(RATE_LIMITS.partnerTicketSubmit, String(user.partner_id ?? user.user_id))
  ]);
  if (limited) return limited;

  try {
    const input = supportTicketSchema.parse(await request.json());
    if (!user.partner_id || !user.organization_id) throw new Error("A partneri fiók nincs partnerhez kapcsolva.");
    if (!(await supportTablesReady())) throw new Error("Az ügyfélszolgálati ticket modul adatbázis migrációja még nincs alkalmazva.");

    const result = await transaction(async (client) => {
      const partnerResult = await client.query<{ id: number; name: string; email: string | null; phone: string | null }>(`
        select id,name,email,phone
          from public.partners
         where id=$1 and organization_id=$2 and active=true and archived_at is null
      `, [user.partner_id, user.organization_id]);
      const partner = partnerResult.rows[0];
      if (!partner) throw new Error("A partner nem található vagy inaktív.");

      let orderId: number | null = null;
      if (input.orderNumber) {
        const orderResult = await client.query<{ id: number }>(`
          select id
            from public.orders
           where partner_id=$1 and organization_id=$2 and order_number=$3 and archived_at is null
           limit 1
        `, [partner.id, user.organization_id, input.orderNumber]);
        orderId = orderResult.rows[0]?.id ?? null;
      }

      const ticketResult = await client.query<any>(`
        insert into public.support_tickets(
          organization_id,partner_id,order_id,order_number,subject,priority,status,created_by,last_message_at
        ) values($1,$2,$3,$4,$5,$6,'open',$7,now())
        returning id,subject,status,created_at
      `, [user.organization_id, partner.id, orderId, input.orderNumber || null, input.subject, input.priority, user.user_id]);
      const ticket = ticketResult.rows[0];

      await client.query(`
        insert into public.support_ticket_messages(
          organization_id,ticket_id,sender_user_id,sender_role,body
        ) values($1,$2,$3,'partner',$4)
      `, [user.organization_id, ticket.id, user.user_id, input.message]);

      const taskResult = await client.query<any>(`
        insert into public.tasks(
          organization_id,title,description,partner_id,order_id,priority,source,created_by
        ) values($1,$2,$3,$4,$5,$6,'partner_followup',$7)
        returning id,title,created_at
      `, [
        user.organization_id,
        `Partner panasz: ${input.subject}`,
        [
          `Partner: ${partner.name}`,
          user.email ? `Beküldő: ${user.email}` : null,
          partner.phone ? `Telefon: ${partner.phone}` : null,
          input.orderNumber ? `Kapcsolódó rendelés: ${input.orderNumber}` : null,
          "",
          input.message
        ].filter(Boolean).join("\n"),
        partner.id,
        orderId,
        input.priority,
        user.user_id
      ]);
      const task = taskResult.rows[0];

      await client.query(`update public.support_tickets set task_id=$1 where id=$2 and organization_id=$3 and partner_id=$4`, [task.id, ticket.id, user.organization_id, partner.id]);

      await client.query(`
        insert into public.notifications(organization_id,role_code,type,title,body,entity_type,entity_id)
        values($1,'admin','partner.support.ticket','Új partneri panasz érkezett',$2,'support_ticket',$3)
      `, [user.organization_id, `${partner.name}: ${input.subject}`, String(ticket.id)]);

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,'partner.support.ticket.created','support_ticket',$2,$3::jsonb)
      `, [user.user_id, String(ticket.id), JSON.stringify({ partner_id: partner.id, task_id: task.id, subject: input.subject, priority: input.priority, order_number: input.orderNumber || null })]);

      return ticket;
    });

    return NextResponse.json({ ticket: result }, { status: 201 });
  } catch (error) {
    return apiError(error, "A panasz beküldése sikertelen.", { route: "/api/partner/support", userId: user.user_id, partnerId: user.partner_id });
  }
}
