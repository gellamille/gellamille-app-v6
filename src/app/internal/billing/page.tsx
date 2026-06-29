import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { query } from "@/lib/db";
import { dateHU, dateTimeHU, money } from "@/lib/format";
import { requireAppUser } from "@/lib/auth";
import {
  billingDocumentStatusLabels,
  billingDocumentTypeLabels,
  billingPaymentStatusLabels,
  billingProviderStatusLabels,
  huLabel
} from "@/lib/status";

type SearchParams = Record<string, string | string[] | undefined>;

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BillingPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const user = await requireAppUser(["admin", "management", "finance"]);
  const params = await searchParams;
  const status = single(params?.status) ?? "";
  const provider = single(params?.provider) ?? "";

  const ready = await billingSchemaReady();
  if (!ready) {
    return (
      <div className="page">
        <PageHeader
          title="Számlázás"
          description="Itt lesz a számlázás központi kezelőfelülete, innen indul majd a Számlázz.hu integráció."
        />
        <div className="alert alert-warning">
          A számlázási adatmodell még nincs aktiválva az adatbázisban. Futtasd a `database/migrations/016_billing_foundation.sql` migrációt, utána ez az oldal automatikusan éles adatokkal töltődik.
        </div>
        <BillingIntegrationNotes />
      </div>
    );
  }

  const where = ["bd.organization_id=$1", "bd.archived_at is null"];
  const values: unknown[] = [user.organization_id];
  if (status && billingDocumentStatusLabels[status]) {
    values.push(status);
    where.push(`bd.status=$${values.length}`);
  }
  if (provider) {
    values.push(provider);
    where.push(`coalesce(bd.external_provider,'')=$${values.length}`);
  }

  const documents = await query<any>(`
    select bd.*, p.name as partner_name, o.order_number, r.receivable_number,
           coalesce(item_counts.item_count,0)::int as item_count
      from public.billing_documents bd
      join public.partners p on p.id=bd.partner_id
      left join public.orders o on o.id=bd.order_id
      left join public.receivables r on r.id=bd.receivable_id
      left join (
        select billing_document_id,count(*)::int as item_count
          from public.billing_document_items
         group by billing_document_id
      ) item_counts on item_counts.billing_document_id=bd.id
     where ${where.join(" and ")}
     order by coalesce(bd.due_date,bd.created_at::date) desc, bd.id desc
     limit 250
  `, values);

  const metrics = await query<any>(`
    select
      count(*)::int as total_count,
      count(*) filter(where status in ('draft','ready','failed'))::int as actionable_count,
      count(*) filter(where status in ('issued','partially_paid','paid','overdue'))::int as issued_count,
      count(*) filter(where status='failed')::int as failed_count,
      coalesce(sum(gross_amount_huf) filter(where status not in ('void','cancelled')),0)::bigint as gross_total_huf,
      coalesce(sum(gross_amount_huf-paid_huf) filter(where payment_status in ('unpaid','partially_paid','unknown') and status not in ('void','cancelled')),0)::bigint as open_total_huf
      from public.billing_documents
     where organization_id=$1 and archived_at is null
  `, [user.organization_id]);

  const settings = await query<any>(`
    select * from public.billing_provider_settings
     where organization_id=$1
     order by provider, environment
  `, [user.organization_id]);

  const messages = await query<any>(`
    select m.*, bd.external_invoice_number, p.name as partner_name
      from public.billing_provider_messages m
      left join public.billing_documents bd on bd.id=m.billing_document_id
      left join public.partners p on p.id=bd.partner_id
     where m.organization_id=$1
     order by m.created_at desc
     limit 30
  `, [user.organization_id]);

  const m = metrics[0] ?? {};

  return (
    <div className="page">
      <PageHeader
        title="Számlázás"
        description="Számlázandó tételek, kiállított számlák és Számlázz.hu szinkron egy helyen."
        actions={<Link href="/internal/finance" className="button">Pénzügy</Link>}
      />

      <section className="grid grid-4">
        <div className="card metric"><div className="metric-label">Számlázási tételek</div><div className="metric-value">{m.total_count ?? 0}</div><div className="metric-note">Összes számladokumentum</div></div>
        <div className="card metric"><div className="metric-label">Teendő</div><div className="metric-value">{m.actionable_count ?? 0}</div><div className="metric-note">Piszkozat, várakozó vagy hibás</div></div>
        <div className="card metric"><div className="metric-label">Kiállítva</div><div className="metric-value">{m.issued_count ?? 0}</div><div className="metric-note">Számlaszámmal vagy fizetési státusszal</div></div>
        <div className="card metric"><div className="metric-label">Nyitott bruttó</div><div className="metric-value">{money(m.open_total_huf)}</div><div className="metric-note">Számlázási nézet szerint</div></div>
      </section>

      <BillingIntegrationNotes />

      <section className="section-gap">
        <div className="card-title-row">
          <h2>Számlák</h2>
          <form className="inline" action="/internal/billing">
            <label>Állapot<select name="status" defaultValue={status}>
              <option value="">Minden</option>
              {Object.entries(billingDocumentStatusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select></label>
            <label>Szolgáltató<select name="provider" defaultValue={provider}>
              <option value="">Minden</option>
              <option value="szamlazz_hu">Számlázz.hu</option>
            </select></label>
            <button className="button button-primary">Szűrés</button>
            <Link className="button" href="/internal/billing">Alaphelyzet</Link>
          </form>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Partner</th><th>Dokumentum</th><th>Rendelés</th><th>Dátumok</th><th>Bruttó</th><th>Fizetés</th><th>Állapot</th><th>Szolgáltató</th></tr></thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.partner_name}</td>
                  <td>
                    <strong>{huLabel(billingDocumentTypeLabels, doc.document_type)}</strong>
                    <div className="mono text-muted">{doc.external_invoice_number ?? doc.receivable_number ?? `BILL-${doc.id}`}</div>
                    <div className="text-muted">{doc.item_count} tétel</div>
                  </td>
                  <td>{doc.order_id ? <Link className="mono" href={`/internal/orders/${doc.order_id}`}>{doc.order_number}</Link> : "—"}</td>
                  <td>
                    <div>Teljesítés: {dateHU(doc.fulfillment_date)}</div>
                    <div className="text-muted">Esedékes: {dateHU(doc.due_date)}</div>
                  </td>
                  <td>{money(doc.gross_amount_huf)}</td>
                  <td>
                    <StatusBadge value={doc.payment_status} label={huLabel(billingPaymentStatusLabels, doc.payment_status)} />
                    <div className="text-muted">{money(doc.paid_huf)} fizetve</div>
                  </td>
                  <td><StatusBadge value={doc.status} label={huLabel(billingDocumentStatusLabels, doc.status)} /></td>
                  <td>
                    {doc.external_provider === "szamlazz_hu" ? "Számlázz.hu" : "Belső"}
                    <div className="text-muted">{doc.last_synced_at ? `Szinkron: ${dateTimeHU(doc.last_synced_at)}` : "Nincs szinkron"}</div>
                    {doc.error_message ? <div className="text-danger">{doc.error_message}</div> : null}
                  </td>
                </tr>
              ))}
              {!documents.length ? <tr><td colSpan={8}>Nincs a szűrésnek megfelelő számlázási tétel.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-2 section-gap">
        <div>
          <h2>Számlázz.hu kapcsolat</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Környezet</th><th>Állapot</th><th>Utolsó ellenőrzés</th><th>Beállítás</th></tr></thead>
              <tbody>
                {settings.map((setting) => (
                  <tr key={setting.id}>
                    <td>{setting.environment === "production" ? "Éles" : "Teszt"}</td>
                    <td><StatusBadge value={setting.status} label={huLabel(billingProviderStatusLabels, setting.status)} /></td>
                    <td>{dateTimeHU(setting.last_checked_at)}</td>
                    <td>{setting.agent_key_secret_name ? "Agent kulcs secret név megadva" : "Agent kulcs még nincs beállítva"}</td>
                  </tr>
                ))}
                {!settings.length ? <tr><td colSpan={4}>Még nincs szolgáltató-beállítás.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2>Integrációs napló</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Időpont</th><th>Irány</th><th>Típus</th><th>Állapot</th><th>Kapcsolat</th></tr></thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id}>
                    <td>{dateTimeHU(message.created_at)}</td>
                    <td>{message.direction === "outbound" ? "Kimenő" : "Bejövő"}</td>
                    <td>{message.message_type}</td>
                    <td>{message.status}</td>
                    <td>{message.external_invoice_number ?? message.partner_name ?? "—"}{message.error_message ? <div className="text-danger">{message.error_message}</div> : null}</td>
                  </tr>
                ))}
                {!messages.length ? <tr><td colSpan={5}>Még nincs integrációs esemény.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

async function billingSchemaReady() {
  const result = await query<{ exists: boolean }>(`
    select to_regclass('public.billing_documents') is not null as exists
  `);
  return result[0]?.exists === true;
}

function BillingIntegrationNotes() {
  return (
    <section className="card section-gap">
      <h2>Integrációs kiindulás</h2>
      <p className="text-muted">
        A Számlázz.hu Számla Agent lesz a számla kiállítási csatorna. A fizetési státuszok később a Számlázz.hu Pénzügyi adatkapcsolat bejövő üzeneteiből frissíthetők.
      </p>
      <div className="grid grid-3 section-gap-small">
        <div><strong>1. Számlázandó</strong><p className="text-muted">Átadás után a követelésből számladokumentum jön létre.</p></div>
        <div><strong>2. Kiállítás</strong><p className="text-muted">A rendszer Számlázz.hu XML kérést készít és naplózza a választ.</p></div>
        <div><strong>3. Fizetés</strong><p className="text-muted">A bejövő pénzügyi adatkapcsolat frissíti a fizetési állapotot.</p></div>
      </div>
    </section>
  );
}
