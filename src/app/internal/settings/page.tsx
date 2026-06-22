import { PageHeader } from "@/components/PageHeader";
import { query } from "@/lib/db";
import { DataArchiveForm } from "./DataArchiveForm";
import { UserCreateForm } from "./UserCreateForm";

export default async function SettingsPage() {
  const users = await query<any>(`
    select au.user_id, au.display_name, au.email, au.role, au.active, p.name as partner_name
      from public.app_users au left join public.partners p on p.id=au.partner_id
     order by au.role, au.display_name
  `);
  const recipients = await query<any>(`select * from public.notification_recipients where active=true order by event_type,email`);
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
          <div className="table-wrap"><table><thead><tr><th>Esemény</th><th>Név</th><th>E-mail</th></tr></thead><tbody>
            {recipients.map(r => <tr key={r.id}><td>{r.event_type}</td><td>{r.name ?? "—"}</td><td>{r.email}</td></tr>)}
            {!recipients.length ? <tr><td colSpan={3}>Új rendelési címzett még nincs beállítva.</td></tr> : null}
          </tbody></table></div>
        </div>
      </section>
    </div>
  );
}
