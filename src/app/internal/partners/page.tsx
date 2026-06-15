import { randomUUID } from 'node:crypto';
import Link from 'next/link';
import type { PaginatedResponse, PartnerDto } from '@/contracts';
import { Pagination } from '@/components/pagination';
import { apiFetch } from '@/lib/api/server';
import { CreatePartnerForm } from './create-partner-form';

export const metadata = { title: 'Partnerek' };

export default async function PartnersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const q = typeof params.q === 'string' ? params.q : '';
  const query = new URLSearchParams({ page: String(page), pageSize: '50' });
  if (q) query.set('q', q);
  const data = await apiFetch<PaginatedResponse<PartnerDto>>(`/partners?${query.toString()}`);

  return (
    <>
      <header className="topbar"><div><h1>Partnerek</h1><div className="muted small">Partneradatok és kapcsolódó szállítmányok.</div></div></header>
      <div className="grid-2">
        <section className="card"><h2>Új partner</h2><CreatePartnerForm idempotencyKey={randomUUID()} /></section>
        <section className="card">
          <form className="toolbar" method="get"><div><label htmlFor="q">Keresés</label><input id="q" name="q" defaultValue={q} placeholder="Partner neve" /></div><button className="button button-secondary" type="submit">Keresés</button></form>
          {data.items.length ? data.items.map((partner) => (
            <div className="card embedded-card" key={partner.id}>
              <div className="toolbar toolbar-compact">
                <div><h3>{partner.name}</h3><div className="muted small">{partner.shippingAddress || 'Nincs szállítási cím'}<br />{partner.contactName || 'Nincs kapcsolattartó'}</div></div>
                <Link className="button button-secondary button-small" href={`/internal/partners/${partner.id}`}>Adatlap</Link>
              </div>
              <div className="muted small">{partner.shipmentCount ?? 0} szállítmány · {(partner.allocatedUnits ?? 0).toLocaleString('hu-HU')} db hozzárendelve</div>
            </div>
          )) : <div className="empty">Még nincs partner.</div>}
          <Pagination page={data.page} totalPages={data.totalPages} path="/internal/partners" query={{ q }} />
        </section>
      </div>
    </>
  );
}
