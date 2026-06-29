import { InternalNav } from "@/components/InternalNav";
import { InternalNotifications } from "@/components/InternalNotifications";
import { INTERNAL_ROLES, requireAppUser } from "@/lib/auth";
import { one, query } from "@/lib/db";
import { supportTablesReady } from "@/lib/support";

export const dynamic = "force-dynamic";

export default async function InternalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAppUser(INTERNAL_ROLES);
  const submitted = await one<{ count: number }>(`select count(*)::int as count from public.orders where status='submitted' and organization_id=$1 and archived_at is null`, [user.organization_id]);
  const supportReady = await supportTablesReady();
  const openSupport = supportReady
    ? await one<{ count: number }>(`
        select count(*)::int as count
          from public.support_tickets
         where organization_id=$1 and archived_at is null and status in ('open','in_progress')
      `, [user.organization_id])
    : null;
  const notifications = await query<any>(`
    select *
      from public.notifications
     where organization_id=$1
       and (user_id=$2::uuid or (user_id is null and (role_code is null or role_code=$3)))
     order by created_at desc
     limit 8
  `, [user.organization_id, user.user_id, user.role]);

  return (
    <div className="app-shell">
      <InternalNav role={user.role} submittedOrders={submitted?.count ?? 0} openSupportTickets={openSupport?.count ?? 0} />
      <main className="content">
        <div className="topbar">
          <InternalNotifications notifications={notifications} />
          <span>{user.display_name ?? user.email}</span>
          <span className="role-pill">{user.role}</span>
        </div>
        {children}
      </main>
    </div>
  );
}
