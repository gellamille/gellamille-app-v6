import Link from "next/link";
import { Phone, TicketCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { requireAppUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { dateHU } from "@/lib/format";
import { huLabel, supportTicketPriorityLabels, supportTicketStatusLabels } from "@/lib/status";
import { supportTablesReady } from "@/lib/support";
import { SupportTicketForm } from "./SupportTicketForm";

export default async function PartnerSupportPage() {
  const user = await requireAppUser(["partner"]);
  const supportReady = await supportTablesReady();
  const tickets = supportReady
    ? await query<any>(`
        select id,subject,priority,status,order_number,last_message_at,created_at
          from public.support_tickets
         where partner_id=$1 and organization_id=$2 and archived_at is null
         order by case status when 'open' then 1 when 'in_progress' then 2 when 'waiting_partner' then 3 else 4 end,
                  last_message_at desc
      `, [user.partner_id, user.organization_id])
    : [];

  return (
    <div>
      <PageHeader title="Ügyfélszolgálat" description="Panasz, rendelési kérdés vagy termékkel kapcsolatos jelzés beküldése." />
      {!supportReady ? <div className="alert alert-warning section-gap">Az ügyfélszolgálati ticket modul adatbázis migrációja még nincs alkalmazva.</div> : null}
      <section className="support-layout">
        <SupportTicketForm />
        <aside className="support-contact-card">
          <div className="support-contact-icon"><Phone size={22} /></div>
          <h2>Telefonos kapcsolat</h2>
          <p>Sürgős vagy személyes egyeztetést igénylő ügyben keresd közvetlenül az ügyfélszolgálatot.</p>
          <strong>Petyánszki Krisztián</strong>
          <a href="tel:+36708020689">+36 70 802 0689</a>
          <div className="support-note">
            <TicketCheck size={18} />
            <span>A beküldött panasz ticketként bekerül a Gellamille belső feladatlistájába.</span>
          </div>
        </aside>
      </section>
      <section className="card section-gap">
        <div className="card-title-row"><h2>Korábbi ticketek</h2></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Ticket</th><th>Kapcsolódó rendelés</th><th>Prioritás</th><th>Állapot</th><th>Utolsó üzenet</th></tr></thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td><Link href={`/partner/support/${ticket.id}`}><strong>#{ticket.id}</strong> {ticket.subject}</Link></td>
                  <td>{ticket.order_number ?? "—"}</td>
                  <td>{huLabel(supportTicketPriorityLabels, ticket.priority)}</td>
                  <td><StatusBadge value={ticket.status} label={huLabel(supportTicketStatusLabels, ticket.status)} /></td>
                  <td>{dateHU(ticket.last_message_at)}</td>
                </tr>
              ))}
              {!tickets.length ? <tr><td colSpan={5}>Még nincs beküldött ticket.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
