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
    await client.query(`
      update public.receivables r set status=case
        when v.outstanding_huf<=0 then 'paid'
        when v.due_date<current_date then 'overdue'
        when v.paid_huf>0 then 'partially_paid'
        else 'receivable' end
      from public.v_receivables_open v where v.id=r.id and r.status<>'void'
    `);
    await client.query(`
      update public.orders o set finance_status=case
        when not exists(select 1 from public.receivables r where r.order_id=o.id and r.status<>'void') then o.finance_status
        when exists(select 1 from public.v_receivables_open v where v.order_id=o.id and v.status='overdue') then 'overdue'
        when exists(select 1 from public.v_receivables_open v where v.order_id=o.id and v.outstanding_huf>0 and v.paid_huf>0) then 'partially_paid'
        when not exists(select 1 from public.v_receivables_open v where v.order_id=o.id and v.outstanding_huf>0) then 'paid'
        else 'receivable' end
      where o.status in ('closed','approved','partially_approved')
    `);
    return maintenance.rows[0]?.result;
  });
  const emailResult = await processEmailOutbox(20).catch((error) => ({ enabled: true, processed: [], error: error instanceof Error ? error.message : "E-mail hiba" }));
  const queued = await one<{ count: string }>(`select count(*)::text count from public.email_outbox where status='queued'`);
  return NextResponse.json({ status: "ok", maintenance: result, email: emailResult, queued_emails: Number(queued?.count ?? 0) });
}
