import { PageHeader } from "@/components/PageHeader";
import { query } from "@/lib/db";
import { requireAppUser } from "@/lib/auth";
import { DataArchiveForm } from "./DataArchiveForm";
import { UserCreateForm } from "./UserCreateForm";
import { NotificationRecipientForm } from "./NotificationRecipientForm";

const recipientEventLabels: Record<string, string> = {
  new_order: "Új rendelés érkezett",
  order_changed: "Rendelés módosult",
  order_updated: "Rendelés módosult",
  order_deleted: "Rendelés törölve",
  product_recall: "Termékvisszahívás"
};

export default async function SettingsPage() {
  const user = await requireAppUser(["admin"]);
  const users = await query<any>(`
    select au.user_id, au.display_name, au.email, au.role, au.active, p.name as partner_name
      from public.app_users au
      left join public.partners p on p.id=au.partner_id and p.organization_id=au.organization_id
     where au.organization_id=$1
     order by au.role, au.display_name
  `, [user.organization_id]);
  const recipients = await query<any>(`select * from public.notification_recipients where organization_id=$1 and active=true order by event_type,email`, [user.organization_id]);
  return (
    <div className="page">
      <PageHeader title="Beállítások és jogosultságok" description="A gyártási dolgozó csak a gyártás, LOT, készlet és alapanyag területeket látja." />
      <UserCreateForm />
      <section className="section-gap">
        <DataArchiveForm />
      </section>
      <section className="grid grid-2">
        <div>
          <h2>Felhasználók</h2>
          <div className="table-wrap"><table><thead><tr><th>Név</th><th>E-mail</th><th>Szerepkör</th><th>Partner</th><th>Aktív</th></tr></thead><tbody>
            {users.map(u => <tr key={u.user_id}><td>{u.display_name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.partner_name ?? "—"}</td><td>{u.active ? "Igen" : "Nem"}</td></tr>)}
          </tbody></table></div>
        </div>
        <div>
          <h2>E-mail címzettek</h2>
          <NotificationRecipientForm />
          <div className="table-wrap"><table><thead><tr><th>Esemény</th><th>Név</th><th>E-mail</th></tr></thead><tbody>
            {recipients.map(r => <tr key={r.id}><td>{recipientEventLabels[r.event_type] ?? r.event_type}</td><td>{r.name ?? "—"}</td><td>{r.email}</td></tr>)}
            {!recipients.length ? <tr><td colSpan={3}>Új rendelési címzett még nincs beállítva.</td></tr> : null}
          </tbody></table></div>
        </div>
      </section>
    </div>
  );
}
