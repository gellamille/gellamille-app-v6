import { InternalNav } from "@/components/InternalNav";
import { INTERNAL_ROLES, requireAppUser } from "@/lib/auth";
import { one, query } from "@/lib/db";
import { dateTimeHU } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function InternalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAppUser(INTERNAL_ROLES);
  const submitted = await one<{ count: number }>(`select count(*)::int as count from public.orders where status='submitted' and organization_id=$1 and archived_at is null`, [user.organization_id]);
  const notifications = await query<any>(`
    select *
      from public.notifications
     where organization_id=$1
       and (user_id=$2::uuid or (user_id is null and (role_code is null or role_code=$3)))
     order by created_at desc
     limit 8
  `, [user.organization_id, user.user_id, user.role]);
  const unread = notifications.filter((item) => !item.read_at).length;

  return (
    <div className="app-shell">
      <InternalNav role={user.role} submittedOrders={submitted?.count ?? 0} />
      <main className="content">
        <div className="topbar">
          <details className="notification-menu">
            <summary>Értesítések{unread > 0 ? <span className="nav-badge">{unread}</span> : null}</summary>
            <div className="notification-panel">
              {notifications.map((item) => (
                <div className="notification-item" key={item.id}>
                  <strong>{item.title}</strong>
                  <div>{item.body ?? ""}</div>
                  <small>{dateTimeHU(item.created_at)}</small>
                </div>
              ))}
              {!notifications.length ? <div className="empty-state">Még nincs rendszerértesítés.</div> : null}
            </div>
          </details>
          <span>{user.display_name ?? user.email}</span>
          <span className="role-pill">{user.role}</span>
        </div>
        {children}
      </main>
    </div>
  );
}
