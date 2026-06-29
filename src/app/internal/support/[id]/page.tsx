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
import { SupportTicketControls } from "../SupportTicketControls";

export default async function InternalSupportTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAppUser(["admin", "management", "staff", "sales", "finance"]);
  if (!(await supportTablesReady())) notFound();
  const { id } = await params;
  const ticket = await one<any>(`
    select st.*, p.name as partner_name, p.email as partner_email, p.phone as partner_phone, au.display_name as assignee_name
      from public.support_tickets st
      join public.partners p on p.id=st.partner_id
      left join public.app_users au on au.user_id=st.assigned_to
     where st.id=$1 and st.organization_id=$2 and st.archived_at is null
  `, [Number(id), user.organization_id]);
  if (!ticket) notFound();

  const messages = await query<any>(`
    select m.*, coalesce(au.display_name, au.email) as sender_name
      from public.support_ticket_messages m
      left join public.app_users au on au.user_id=m.sender_user_id
     where m.ticket_id=$1 and m.organization_id=$2
     order by m.created_at
  `, [ticket.id, user.organization_id]);
  const closed = ["closed", "cancelled"].includes(ticket.status);

  return (
    <div className="page">
      <Link href="/internal/support" className="back-link"><ArrowLeft size={16} /> Vissza</Link>
      <PageHeader title={`Ticket #${ticket.id}`} description={ticket.subject} />
      <section className="card support-ticket-summary">
        <div><span>Partner</span><strong>{ticket.partner_name}</strong></div>
        <div><span>Állapot</span><StatusBadge value={ticket.status} label={huLabel(supportTicketStatusLabels, ticket.status)} /></div>
        <div><span>Prioritás</span><strong>{huLabel(supportTicketPriorityLabels, ticket.priority)}</strong></div>
        <div><span>Rendelés</span><strong>{ticket.order_number ?? "—"}</strong></div>
        <div><span>Kapcsolat</span><strong>{ticket.partner_email ?? "—"}{ticket.partner_phone ? ` · ${ticket.partner_phone}` : ""}</strong></div>
        <div><span>Beküldve</span><strong>{dateHU(ticket.created_at)}</strong></div>
      </section>
      {!closed ? <SupportTicketControls ticketId={Number(ticket.id)} status={ticket.status} /> : null}
      <SupportConversation ticketId={Number(ticket.id)} messages={messages} currentSide="internal" disabled={closed} />
    </div>
  );
}
