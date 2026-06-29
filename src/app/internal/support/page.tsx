import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { requireAppUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { dateHU } from "@/lib/format";
import { huLabel, supportTicketPriorityLabels, supportTicketStatusLabels } from "@/lib/status";
import { supportTablesReady } from "@/lib/support";

export default async function InternalSupportPage() {
  const user = await requireAppUser(["admin", "management", "staff", "sales", "finance"]);
  const supportReady = await supportTablesReady();
  const tickets = supportReady
    ? await query<any>(`
        select st.*, p.name as partner_name, au.display_name as assignee_name
          from public.support_tickets st
          join public.partners p on p.id=st.partner_id
          left join public.app_users au on au.user_id=st.assigned_to
         where st.organization_id=$1 and st.archived_at is null
         order by case st.status when 'open' then 1 when 'in_progress' then 2 when 'waiting_partner' then 3 else 4 end,
                  st.last_message_at desc
      `, [user.organization_id])
    : [];

  return (
    <div className="page">
      <PageHeader title="Ügyfélszolgálat" description="Partneri panaszok és ügyfélszolgálati beszélgetések kezelése." />
      {!supportReady ? <div className="alert alert-warning section-gap">A support ticket táblák még nincsenek létrehozva. Futtasd a 017-es migrációt.</div> : null}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Ticket</th><th>Partner</th><th>Rendelés</th><th>Prioritás</th><th>Állapot</th><th>Felelős</th><th>Utolsó üzenet</th></tr></thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td><Link href={`/internal/support/${ticket.id}`}><strong>#{ticket.id}</strong> {ticket.subject}</Link></td>
                <td>{ticket.partner_name}</td>
                <td>{ticket.order_number ?? "—"}</td>
                <td>{huLabel(supportTicketPriorityLabels, ticket.priority)}</td>
                <td><StatusBadge value={ticket.status} label={huLabel(supportTicketStatusLabels, ticket.status)} /></td>
                <td>{ticket.assignee_name ?? "Nincs kijelölve"}</td>
                <td>{dateHU(ticket.last_message_at)}</td>
              </tr>
            ))}
            {!tickets.length ? <tr><td colSpan={7}>Nincs ügyfélszolgálati ticket.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
