import Link from 'next/link';
import type { LotStockDto, PaginatedResponse } from '@/contracts';
import { Pagination } from '@/components/pagination';
import { apiFetch } from '@/lib/api/server';

export const metadata = { title: 'Készlet' };

type Summary = { physical: number; reserved: number; shipped: number; available: number };

export default async function InventoryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const q = typeof params.q === 'string' ? params.q : '';
  const flavorCode = typeof params.flavorCode === 'string' ? params.flavorCode : '';
  const availability = typeof params.availability === 'string' ? params.availability : 'all';
  const query = new URLSearchParams({ page: String(page), pageSize: '50', availability });
  if (q) query.set('q', q);
  if (flavorCode) query.set('flavorCode', flavorCode);

  const [data, summary, flavors] = await Promise.all([
    apiFetch<PaginatedResponse<LotStockDto>>(`/inventory?${query.toString()}`),
    apiFetch<Summary>('/inventory/summary'),
    apiFetch<Array<{ code: string; name: string }>>('/flavors'),
  ]);

  return (
    <>
      <header className="topbar"><div><h1>Készlet</h1><div className="muted small">A készletet a LOT-ok és a szállítmányfoglalások számítják.</div></div></header>
      <div className="grid-4 stats-spacing">
        <div className="stat"><div className="stat-label">Fizikai készlet</div><div className="stat-value">{summary.physical.toLocaleString('hu-HU')}</div></div>
        <div className="stat"><div className="stat-label">Lefoglalt</div><div className="stat-value">{summary.reserved.toLocaleString('hu-HU')}</div></div>
        <div className="stat"><div className="stat-label">Kiszállított</div><div className="stat-value">{summary.shipped.toLocaleString('hu-HU')}</div></div>
        <div className="stat"><div className="stat-label">Elérhető</div><div className="stat-value">{summary.available.toLocaleString('hu-HU')}</div></div>
      </div>
      <section className="card">
        <form className="toolbar" method="get">
          <div className="toolbar-group">
            <div><label htmlFor="q">Keresés</label><input id="q" name="q" defaultValue={q} placeholder="LOT vagy termék" /></div>
            <div><label htmlFor="flavorCode">Íz</label><select id="flavorCode" name="flavorCode" defaultValue={flavorCode}><option value="">Minden íz</option>{flavors.map((flavor) => <option key={flavor.code} value={flavor.code}>{flavor.name}</option>)}</select></div>
            <div><label htmlFor="availability">Készlet</label><select id="availability" name="availability" defaultValue={availability}><option value="all">Minden aktív LOT</option><option value="available">Csak elérhető</option><option value="empty">Csak kifogyott</option></select></div>
            <button className="button button-secondary" type="submit">Szűrés</button>
          </div>
        </form>
        {data.items.length ? (
          <div className="table-wrap"><table><thead><tr><th>LOT</th><th>Termék</th><th>Gyártva</th><th>Lefoglalva</th><th>Kiszállítva</th><th>Elérhető</th><th>Lejárat</th></tr></thead><tbody>{data.items.map((lot) => <tr key={lot.id}><td><Link className="code" href={`/internal/lots/${lot.id}`}>{lot.lotNumber}</Link></td><td>{lot.flavorName}<div className="muted small">{lot.sizeMl} ml</div></td><td>{lot.quantity.toLocaleString('hu-HU')}</td><td>{lot.reservedQuantity.toLocaleString('hu-HU')}</td><td>{lot.shippedQuantity.toLocaleString('hu-HU')}</td><td><strong>{lot.availableQuantity.toLocaleString('hu-HU')}</strong></td><td>{lot.bestBefore}</td></tr>)}</tbody></table></div>
        ) : <div className="empty">Nincs megjeleníthető készlet.</div>}
        <Pagination page={data.page} totalPages={data.totalPages} path="/internal/inventory" query={{ q, flavorCode, availability }} />
      </section>
    </>
  );
}
