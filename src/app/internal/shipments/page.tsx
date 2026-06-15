import { randomUUID } from 'node:crypto';
import Link from 'next/link';
import type { PaginatedResponse, PartnerDto, ShipmentDto } from '@/contracts';
import { Pagination } from '@/components/pagination';
import { apiFetch } from '@/lib/api/server';
import { CreateShipmentForm } from './create-shipment-form';

export const metadata = { title: 'Szállítmányok' };

const statusLabels: Record<string, string> = {
  draft: 'Piszkozat',
  closed: 'Lezárt',
  shipped: 'Kiszállítva',
  void: 'Sztornózott',
};

export default async function ShipmentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const q = typeof params.q === 'string' ? params.q : '';
  const status = typeof params.status === 'string' ? params.status : '';
  const query = new URLSearchParams({ page: String(page), pageSize: '50' });
  if (q) query.set('q', q);
  if (status) query.set('status', status);

  const [data, partners] = await Promise.all([
    apiFetch<PaginatedResponse<ShipmentDto>>(`/shipments?${query.toString()}`),
    apiFetch<PaginatedResponse<PartnerDto>>('/partners?page=1&pageSize=100'),
  ]);

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Szállítmányok</h1>
          <div className="muted small">LOT-ok lefoglalása, lezárás és kiszállítás.</div>
        </div>
      </header>

      <div className="grid-2 shipments-page-grid">
        <section className="card">
          <h2>Új szállítmány</h2>
          {partners.items.length ? (
            <CreateShipmentForm partners={partners.items} idempotencyKey={randomUUID()} />
          ) : (
            <div className="alert alert-warning">Előbb hozz létre legalább egy aktív partnert.</div>
          )}
        </section>

        <section className="card">
          <form className="toolbar" method="get">
            <div className="toolbar-group">
              <div>
                <label htmlFor="q">Keresés</label>
                <input id="q" name="q" defaultValue={q} placeholder="Szállítmány vagy partner" />
              </div>
              <div>
                <label htmlFor="status">Státusz</label>
                <select id="status" name="status" defaultValue={status}>
                  <option value="">Minden státusz</option>
                  <option value="draft">Piszkozat</option>
                  <option value="closed">Lezárt</option>
                  <option value="shipped">Kiszállítva</option>
                  <option value="void">Sztornózott</option>
                </select>
              </div>
              <button className="button button-secondary" type="submit">Szűrés</button>
            </div>
          </form>

          {data.items.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Szállítmány</th>
                    <th>Partner</th>
                    <th>Dátum</th>
                    <th>LOT</th>
                    <th>Darabszám</th>
                    <th>Státusz</th>
                    <th>Művelet</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((shipment) => (
                    <tr key={shipment.id} className={shipment.status === 'void' ? 'row-void' : undefined}>
                      <td className="code">{shipment.shipmentNumber}</td>
                      <td>{shipment.partnerName}</td>
                      <td>{shipment.shipmentDate}</td>
                      <td>{shipment.lotCount}</td>
                      <td>{shipment.units.toLocaleString('hu-HU')}</td>
                      <td>
                        <span className={`badge badge-${shipment.status}`}>
                          {statusLabels[shipment.status] ?? shipment.status}
                        </span>
                      </td>
                      <td>
                        <Link className="button button-secondary button-small" href={`/internal/shipments/${shipment.id}`}>
                          Megnyitás
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty">Nincs megjeleníthető szállítmány.</div>
          )}
          <Pagination page={data.page} totalPages={data.totalPages} path="/internal/shipments" query={{ q, status }} />
        </section>
      </div>
    </>
  );
}
