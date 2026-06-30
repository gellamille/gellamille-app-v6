import { NextResponse } from "next/server";
import { requireSecret } from "@/lib/http";
import { one, transaction } from "@/lib/db";
import { processEmailOutbox } from "@/lib/email";

export async function GET(request: Request) {
  if (!requireSecret(request, process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  }
  const result = await transaction(async (client) => {
    const maintenance = await client.query<{ result: unknown }>(`select public.run_daily_inventory_maintenance() as result`);
    const lowStockTasks = await client.query<{ created_tasks: number }>(`
      with production_assignee as (
        select organization_id,user_id
          from public.app_users
         where active=true
           and role='production'
      ),
      critical_products as (
        select p.organization_id,s.product_id,s.product_name,s.available_units,s.minimum_stock_units,
               greatest(s.minimum_stock_units-s.available_units,0)::int as missing_units
          from public.v_product_stock_summary s
          join public.products p on p.id=s.product_id
         where p.active=true
           and p.archived_at is null
           and s.minimum_stock_units>0
           and s.available_units<s.minimum_stock_units
           and not exists (
             select 1
               from public.tasks t
              where t.product_id=s.product_id
                and t.source='low_stock'
                and t.status in ('open','in_progress')
                and t.archived_at is null
           )
      ),
      inserted as (
        insert into public.tasks(
          organization_id,title,description,product_id,assigned_to,due_at,priority,source
        )
        select
          organization_id,
          'Készletfeltöltés szükséges: '||product_name,
          product_name||' kritikus készleten van. Elérhető: '||available_units||' db, minimum: '||minimum_stock_units||' db, hiány: '||missing_units||' db.',
          product_id,
          (select user_id from production_assignee pa where pa.organization_id=critical_products.organization_id order by user_id limit 1),
          (current_date + interval '1 day')::timestamptz,
          'urgent',
          'low_stock'
        from critical_products
        returning id,organization_id,title,description,product_id,assigned_to
      ),
      notifications as (
        insert into public.notifications(organization_id,user_id,role_code,type,title,body,entity_type,entity_id)
        select organization_id,assigned_to,
               case when assigned_to is null then 'production' else null end,
               'task.low_stock',title,description,'task',id::text
          from inserted
        returning id
      )
      select (select count(*)::int from inserted) as created_tasks,
             (select count(*)::int from notifications) as queued_notifications
    `);
    await client.query(`
      update public.receivables r set status=case
        when v.outstanding_huf<=0 then 'paid'
        when v.due_date<current_date then 'overdue'
        when v.paid_huf>0 then 'partially_paid'
        else 'receivable' end
      from public.v_receivables_open v where v.id=r.id and r.status<>'void' and r.archived_at is null
    `);
    await client.query(`
      update public.orders o set finance_status=case
        when not exists(select 1 from public.receivables r where r.order_id=o.id and r.status<>'void' and r.archived_at is null) then o.finance_status
        when exists(select 1 from public.v_receivables_open v where v.order_id=o.id and v.status='overdue') then 'overdue'
        when exists(select 1 from public.v_receivables_open v where v.order_id=o.id and v.outstanding_huf>0 and v.paid_huf>0) then 'partially_paid'
        when not exists(select 1 from public.v_receivables_open v where v.order_id=o.id and v.outstanding_huf>0) then 'paid'
        else 'receivable' end
      where o.status in ('closed','approved','partially_approved') and o.archived_at is null
    `);
    await client.query(`
      do $$
      begin
        if to_regclass('public.rate_limit_counters') is not null then
          delete from public.rate_limit_counters
           where updated_at < now() - interval '7 days';
        end if;
      end $$;
    `);
    return {
      maintenance: maintenance.rows[0]?.result,
      low_stock_tasks: lowStockTasks.rows[0]?.created_tasks ?? 0
    };
  });
  const emailResult = await processEmailOutbox(20).catch((error) => ({ enabled: true, processed: [], error: error instanceof Error ? error.message : "E-mail hiba" }));
  const queued = await one<{ count: string }>(`select count(*)::text count from public.email_outbox where status='queued' and archived_at is null`);
  return NextResponse.json({ status: "ok", maintenance: result, email: emailResult, queued_emails: Number(queued?.count ?? 0) });
}
