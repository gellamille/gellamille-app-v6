import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { SupportConversation } from "@/components/SupportConversation";
import { requireAppUser } from "@/lib/auth";
import { one, query } from "@/lib/db";
import { dateHU } from "@/lib/format";
import { huLabel, supportTicketPriorityLabels, supportTicketStatusLabels } from "@/lib/status";
import { supportTablesReady } from "@/lib/support";

export default async function PartnerSupportTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAppUser(["partner"]);
  if (!(await supportTablesReady())) notFound();
  const { id } = await params;
  const ticket = await one<any>(`
    select *
      from public.support_tickets
     where id=$1 and partner_id=$2 and organization_id=$3 and archived_at is null
  `, [Number(id), user.partner_id, user.organization_id]);
  if (!ticket) notFound();

  const messages = await query<any>(`
    select m.*, coalesce(au.display_name, au.email) as sender_name
      from public.support_ticket_messages m
      left join public.app_users au on au.user_id=m.sender_user_id
     where m.ticket_id=$1 and m.organization_id=$2 and m.internal_only=false
     order by m.created_at
  `, [ticket.id, user.organization_id]);
  const closed = ["closed", "cancelled"].includes(ticket.status);

  return (
    <div>
      <Link href="/partner/support" className="back-link"><ArrowLeft size={16} /> Vissza</Link>
      <PageHeader title={`Ticket #${ticket.id}`} description={ticket.subject} />
      <section className="card support-ticket-summary">
        <div><span>Állapot</span><StatusBadge value={ticket.status} label={huLabel(supportTicketStatusLabels, ticket.status)} /></div>
        <div><span>Prioritás</span><strong>{huLabel(supportTicketPriorityLabels, ticket.priority)}</strong></div>
        <div><span>Kapcsolódó rendelés</span><strong>{ticket.order_number ?? "—"}</strong></div>
        <div><span>Beküldve</span><strong>{dateHU(ticket.created_at)}</strong></div>
      </section>
      <SupportConversation ticketId={Number(ticket.id)} messages={messages} currentSide="partner" disabled={closed} />
    </div>
  );
}
