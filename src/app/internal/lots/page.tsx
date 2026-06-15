import Link from 'next/link';
import type { PaginatedResponse, LotDto } from '@/contracts';
import { apiFetch } from '@/lib/api/server';
import { Pagination } from '@/components/pagination';
import { VoidLotButton } from './void-lot-button';

export const metadata = { title: 'Gyártási napló' };

export default async function LotsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const q = typeof params.q === 'string' ? params.q : '';
  const status = typeof params.status === 'string' ? params.status : '';
  const query = new URLSearchParams({ page: String(page), pageSize: '50' });
  if (q) query.set('q', q);
  if (status) query.set('status', status);

  const data = await apiFetch<PaginatedResponse<LotDto>>(`/lots?${query.toString()}`);

  return (
    <>
      <header className="topbar">
        <div><h1>Gyártási napló</h1><div className="muted small">LOT-ok, felelősök, státuszok és lejáratok.</div></div>
      </header>
      <section className="card">
        <form className="toolbar" method="get">
          <div className="toolbar-group">
            <div><label htmlFor="q">Keresés</label><input id="q" name="q" defaultValue={q} placeholder="LOT, íz, felelős" /></div>
            <div><label htmlFor="status">Státusz</label><select id="status" name="status" defaultValue={status}><option value="">Minden LOT</option><option value="active">Aktív</option><option value="void">Sztornózott</option></select></div>
            <button className="button button-secondary" type="submit">Szűrés</button>
          </div>
        </form>
        {data.items.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>LOT</th><th>Státusz</th><th>Gyártás</th><th>Termék</th><th>Db</th><th>Lejárat</th><th>Felelős</th><th>Megjegyzés</th><th></th></tr></thead>
              <tbody>
                {data.items.map((lot) => (
                  <tr key={lot.id} className={lot.status === 'void' ? 'row-void' : ''}>
                    <td><Link className="code" href={`/internal/lots/${lot.id}`}>{lot.lotNumber}</Link></td>
                    <td><span className={`badge badge-${lot.status}`}>{lot.status === 'active' ? 'Aktív' : 'Sztornózott'}</span></td>
                    <td>{lot.productionDate}<div className="muted small">{lot.productionPeriod === 'AM' ? 'Délelőtt' : 'Délután'}</div></td>
                    <td>{lot.flavorName}<div className="muted small">{lot.sizeMl} ml</div></td>
                    <td>{lot.quantity.toLocaleString('hu-HU')}</td>
                    <td>{lot.bestBefore}</td>
                    <td>{lot.operatorName}</td>
                    <td>{lot.status === 'void' ? lot.voidReason : lot.note || '—'}</td>
                    <td>{lot.status === 'active' ? <VoidLotButton id={lot.id} lotNumber={lot.lotNumber} /> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="empty">Nincs találat.</div>}
        <Pagination page={data.page} totalPages={data.totalPages} path="/internal/lots" query={{ q, status }} />
      </section>
    </>
  );
}
