import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query, one } from "@/lib/db";
import { dateHU, money } from "@/lib/format";
import { requireAppUser } from "@/lib/auth";
import { expenseStatusLabels, financeStatusLabels, huLabel } from "@/lib/status";
import { FinanceEntryForms } from "./FinanceEntryForms";

export default async function FinancePage() {
  const user = await requireAppUser(["admin", "management", "finance"]);
  const totals = await one<any>(`
    select
      (select coalesce(sum(gross_amount_huf),0) from public.receivables where organization_id=$1 and status<>'void' and archived_at is null) as revenue,
      (select coalesce(sum(r.gross_amount_huf
        + coalesce((select sum(fa.amount_huf) from public.financial_adjustments fa where fa.receivable_id=r.id and fa.archived_at is null),0)
        - coalesce((select sum(pa.amount_huf) from public.payment_allocations pa join public.payments pay on pay.id=pa.payment_id where pa.receivable_id=r.id and pay.archived_at is null),0)),0)
        from public.receivables r where r.organization_id=$1 and r.status<>'void' and r.archived_at is null) as outstanding,
      (select coalesce(sum(r.gross_amount_huf
        + coalesce((select sum(fa.amount_huf) from public.financial_adjustments fa where fa.receivable_id=r.id and fa.archived_at is null),0)
        - coalesce((select sum(pa.amount_huf) from public.payment_allocations pa join public.payments pay on pay.id=pa.payment_id where pa.receivable_id=r.id and pay.archived_at is null),0)),0)
        from public.receivables r where r.organization_id=$1 and r.status<>'void' and r.archived_at is null and r.due_date < current_date) as overdue,
      (select coalesce(sum(amount_huf),0) from public.payments where organization_id=$1 and archived_at is null) as received,
      (select coalesce(sum(gross_amount_huf),0) from public.expenses where organization_id=$1 and status <> 'void' and archived_at is null) as expenses,
      (select coalesce(sum(cogs_huf),0) from public.delivery_items di join public.deliveries d on d.id=di.delivery_id where d.organization_id=$1 and d.status='delivered' and d.archived_at is null) as cogs,
      (select coalesce(sum(outstanding_huf),0) from public.v_member_loan_balances where organization_id=$1) as member_loans
  `, [user.organization_id]);
  const receivables = await query<any>(`
    select r.id,r.receivable_number,r.partner_id,p.name as partner_name,r.order_id,o.order_number,
           r.delivery_id,r.net_amount_huf,r.vat_amount_huf,r.gross_amount_huf,r.delivered_at,r.due_date,
           coalesce((select sum(pa.amount_huf)
                       from public.payment_allocations pa
                       join public.payments pay on pay.id=pa.payment_id
                      where pa.receivable_id=r.id and pay.archived_at is null),0)::int as paid_huf,
           (r.gross_amount_huf
            + coalesce((select sum(fa.amount_huf)
                          from public.financial_adjustments fa
                         where fa.receivable_id=r.id and fa.archived_at is null),0)
            - coalesce((select sum(pa.amount_huf)
                          from public.payment_allocations pa
                          join public.payments pay on pay.id=pa.payment_id
                         where pa.receivable_id=r.id and pay.archived_at is null),0))::int as outstanding_huf,
           case
            when r.status='void' then 'void'
            when (r.gross_amount_huf
              + coalesce((select sum(fa.amount_huf) from public.financial_adjustments fa where fa.receivable_id=r.id and fa.archived_at is null),0)
              - coalesce((select sum(pa.amount_huf) from public.payment_allocations pa join public.payments pay on pay.id=pa.payment_id where pa.receivable_id=r.id and pay.archived_at is null),0))<=0 then 'paid'
            when r.due_date<current_date then 'overdue'
            when coalesce((select sum(pa.amount_huf) from public.payment_allocations pa join public.payments pay on pay.id=pa.payment_id where pa.receivable_id=r.id and pay.archived_at is null),0)>0 then 'partially_paid'
            else 'receivable' end as status
      from public.receivables r
      join public.partners p on p.id=r.partner_id
      join public.orders o on o.id=r.order_id
     where r.organization_id=$1 and r.status<>'void' and r.archived_at is null and o.archived_at is null
     order by r.due_date, r.id
     limit 250
  `, [user.organization_id]);
  const categories = await query<any>(`select id,name from public.expense_categories where organization_id=$1 and active order by name`, [user.organization_id]);
  const expenses = await query<any>(`
    select e.*, ec.name as category_name
      from public.expenses e left join public.expense_categories ec on ec.id=e.category_id
     where e.organization_id=$1 and e.status <> 'void' and e.archived_at is null order by e.performance_date desc,e.id desc limit 100
  `, [user.organization_id]);
  const loans = await query<any>(`
    select * from public.member_loan_transactions
     where organization_id=$1 and archived_at is null order by transaction_date desc,id desc limit 100
  `, [user.organization_id]);
  const loanBalances = await query<any>(`select * from public.v_member_loan_balances where organization_id=$1 order by member_name`, [user.organization_id]);
  const t = totals ?? {revenue:0,outstanding:0,overdue:0,received:0,expenses:0,cogs:0,member_loans:0};
  const margin = Number(t.revenue)-Number(t.cogs);
  const result = margin-Number(t.expenses);

  return (
    <div className="page">
      <PageHeader title="Pénzügy" description="Nem banki egyenleg és nem számlázás. Átadásból keletkező követelések, beérkezett pénz, ELÁBÉ, kiadások és tagi kölcsönök." />
      <section className="grid grid-4">
        <div className="card metric metric-success"><div className="metric-label">Árbevétel / követelés</div><div className="metric-value">{money(t.revenue)}</div></div>
        <div className="card metric metric-success"><div className="metric-label">Beérkezett pénz</div><div className="metric-value">{money(t.received)}</div></div>
        <div className="card metric"><div className="metric-label">Nyitott követelés</div><div className="metric-value">{money(t.outstanding)}</div><div className="metric-note">{money(t.overdue)} lejárt</div></div>
        <div className="card metric"><div className="metric-label">Árrés költségek előtt</div><div className="metric-value">{money(margin)}</div><div className="metric-note">ELÁBÉ: {money(t.cogs)}</div></div>
        <div className="card metric metric-danger"><div className="metric-label">Működési kiadások</div><div className="metric-value">{money(t.expenses)}</div></div>
        <div className="card metric metric-warning"><div className="metric-label">Eredmény</div><div className="metric-value">{money(result)}</div><div className="metric-note">Árbevétel − ELÁBÉ − kiadás</div></div>
        <div className="card metric"><div className="metric-label">Fennálló tagi kölcsön</div><div className="metric-value">{money(t.member_loans)}</div><div className="metric-note">Nem árbevétel és nem nyereség</div></div>
        <div className="card metric"><div className="metric-label">Pénzügyi forrás</div><div className="metric-value" style={{fontSize:22}}>Számlázz.hu</div><div className="metric-note">A számlázás külön rendszerben marad</div></div>
      </section>

      <FinanceEntryForms
        receivables={receivables.filter(r => Number(r.outstanding_huf)>0).map(r => ({id:r.id,receivable_number:r.receivable_number,partner_name:r.partner_name,outstanding_huf:Number(r.outstanding_huf)}))}
        categories={categories}
      />

      <section className="section-gap">
        <h2>Nyitott követelések</h2>
        <div className="table-wrap"><table><thead><tr><th>Azonosító</th><th>Partner</th><th>Rendelés</th><th>Átadás</th><th>Esedékes</th><th>Bruttó</th><th>Fizetve</th><th>Hátralék</th><th>Állapot</th></tr></thead><tbody>
          {receivables.map(r => <tr key={r.id}><td className="mono">{r.receivable_number}</td><td>{r.partner_name}</td><td className="mono">{r.order_number}</td><td>{dateHU(r.delivered_at)}</td><td>{dateHU(r.due_date)}</td><td>{money(r.gross_amount_huf)}</td><td>{money(r.paid_huf)}</td><td><strong>{money(r.outstanding_huf)}</strong></td><td><StatusBadge value={r.status} label={huLabel(financeStatusLabels, r.status)} /></td></tr>)}
          {!receivables.length ? <tr><td colSpan={9}>Nincs követelés.</td></tr> : null}
        </tbody></table></div>
      </section>
      <section className="section-gap grid grid-2">
        <div>
          <h2>Kiadások</h2>
          <div className="table-wrap"><table><thead><tr><th>Teljesítés</th><th>Kifizetés</th><th>Kategória</th><th>Leírás</th><th>Bruttó</th><th>Állapot</th></tr></thead><tbody>
            {expenses.map(e => <tr key={e.id}><td>{dateHU(e.performance_date)}</td><td>{dateHU(e.payment_date)}</td><td>{e.category_name ?? "Egyéb"}</td><td>{e.description}</td><td className="text-danger">{money(e.gross_amount_huf)}</td><td><StatusBadge value={e.status} label={huLabel(expenseStatusLabels, e.status)} /></td></tr>)}
            {!expenses.length ? <tr><td colSpan={6}>Még nincs rögzített kiadás.</td></tr> : null}
          </tbody></table></div>
        </div>
        <div>
          <h2>Tagi kölcsönök</h2>
          <div className="card list" style={{marginBottom:16}}>{loanBalances.length ? loanBalances.map(b => <div className="list-item" key={b.member_name}><span>{b.member_name}</span><strong>{money(b.outstanding_huf)}</strong></div>) : <div className="empty-state">Nincs fennálló tagi kölcsön.</div>}</div>
          <div className="table-wrap"><table><thead><tr><th>Dátum</th><th>Tag</th><th>Típus</th><th>Összeg</th><th>Megjegyzés</th></tr></thead><tbody>
            {loans.map(l => <tr key={l.id}><td>{dateHU(l.transaction_date)}</td><td>{l.member_name}</td><td>{l.transaction_type === "funding" ? "Befizetés" : "Visszafizetés"}</td><td className={l.transaction_type === "funding" ? "text-success" : "text-danger"}>{money(l.amount_huf)}</td><td>{l.note ?? "—"}</td></tr>)}
            {!loans.length ? <tr><td colSpan={5}>Nincs tagi kölcsön tranzakció.</td></tr> : null}
          </tbody></table></div>
        </div>
      </section>
    </div>
  );
}
