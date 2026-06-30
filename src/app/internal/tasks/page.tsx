import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { dateHU } from "@/lib/format";
import { INTERNAL_ROLES, requireAppUser } from "@/lib/auth";
import { huLabel, taskPriorityLabels, taskSourceLabels, taskStatusLabels } from "@/lib/status";
import { NewTaskForm, TaskStatusControl } from "./TaskManager";

export default async function TasksPage() {
  const user = await requireAppUser(INTERNAL_ROLES);
  const canCreate = ["admin","management","sales"].includes(user.role);
  const canUpdate = ["admin","management","sales","production"].includes(user.role);
  const tasks = await query<any>(`
    select t.*, p.name as partner_name, o.order_number, au.display_name as assignee_name
      from public.tasks t
      left join public.partners p on p.id=t.partner_id and p.organization_id=t.organization_id
      left join public.orders o on o.id=t.order_id and o.organization_id=t.organization_id
      left join public.app_users au on au.user_id=t.assigned_to and au.organization_id=t.organization_id
     where t.organization_id=$1 and t.archived_at is null
       and ($2::text <> 'production' or t.assigned_to=$3::uuid or t.source='low_stock')
     order by case t.status when 'open' then 1 when 'in_progress' then 2 else 3 end,
              t.due_at nulls last, t.id desc
  `, [user.organization_id, user.role, user.user_id]);
  const partners=await query<any>(`select id,name from public.partners where organization_id=$1 and active and archived_at is null order by name`, [user.organization_id]);
  const users=await query<any>(`select user_id id,coalesce(display_name,email) name from public.app_users where organization_id=$1 and active and role<>'partner' order by name`, [user.organization_id]);
  return (
    <div className="page">
      <PageHeader title="Feladatok" description="Partnerhez, rendeléshez, termékhez vagy szállításhoz kapcsolható kézi és automatikus teendők." />
      {canCreate ? <NewTaskForm partners={partners} users={users} /> : null}
      <div className="table-wrap section-gap"><table><thead><tr><th>Feladat</th><th>Partner / rendelés</th><th>Felelős</th><th>Határidő</th><th>Prioritás</th><th>Forrás</th><th>Állapot</th><th>Művelet</th></tr></thead><tbody>
        {tasks.map(t => <tr key={t.id}><td><strong>{t.title}</strong><div className="text-muted">{t.description ?? ""}</div></td><td>{t.partner_name ?? "—"}<div className="mono text-muted">{t.order_number ?? ""}</div></td><td>{t.assignee_name ?? "Nincs kijelölve"}</td><td>{dateHU(t.due_at)}</td><td>{huLabel(taskPriorityLabels, t.priority)}</td><td>{huLabel(taskSourceLabels, t.source)}</td><td><StatusBadge value={t.status} label={huLabel(taskStatusLabels, t.status)} /></td><td>{canUpdate ? <TaskStatusControl id={t.id} status={t.status} /> : null}</td></tr>)}
        {!tasks.length ? <tr><td colSpan={8}>Nincs feladat.</td></tr> : null}
      </tbody></table></div>
    </div>
  );
}
