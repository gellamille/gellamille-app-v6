import Link from 'next/link';
import type {
  OrderDto,
  OrderStatus,
  PaginatedResponse,
} from '@/contracts';
import { Pagination } from '@/components/pagination';
import { apiFetch } from '@/lib/api/server';

export const metadata = { title: 'Rendelések' };

const statusLabels: Record<OrderStatus, string> = {
  draft: 'Piszkozat',
  submitted: 'Új',
  approved: 'Jóváhagyva',
  stock_shortage: 'Készlethiányos',
  allocating: 'LOT-kiosztás alatt',
  shipment_created: 'Szállítmányba rendezve',
  shipped: 'Kiszállítva',
  rejected: 'Elutasítva',
  void: 'Sztornózott',
};

const paymentLabels: Record<string, string> = {
  cash_on_delivery: 'Helyszínen készpénz',
  card_on_delivery: 'Helyszínen kártya',
  bank_transfer: 'Átutalás',
};

function money(value: number) {
  return `${value.toLocaleString('hu-HU')} Ft`;
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const q = typeof params.q === 'string' ? params.q : '';
  const status = typeof params.status === 'string' ? params.status : '';

  const query = new URLSearchParams({
    page: String(page),
    pageSize: '50',
  });
  if (q) query.set('q', q);
  if (status) query.set('status', status);

  const data = await apiFetch<PaginatedResponse<OrderDto>>(
    `/orders?${query.toString()}`,
  );

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Rendelések</h1>
          <div className="muted small">
            Partneri rendelések, összegek és feldolgozási állapotok.
          </div>
        </div>
      </header>

      <section className="card">
        <form className="toolbar" method="get">
          <div className="toolbar-group">
            <div>
              <label htmlFor="q">Keresés</label>
              <input
                id="q"
                name="q"
                defaultValue={q}
                placeholder="Rendelésszám vagy partner"
              />
            </div>
            <div>
              <label htmlFor="status">Státusz</label>
              <select id="status" name="status" defaultValue={status}>
                <option value="">Minden státusz</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className="button button-secondary" type="submit">
            Szűrés
          </button>
        </form>

        {data.items.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rendelés</th>
                  <th>Partner</th>
                  <th>Szállítás</th>
                  <th>Karton</th>
                  <th>Darab</th>
                  <th>Nettó</th>
                  <th>Áfa</th>
                  <th>Bruttó</th>
                  <th>Fizetés</th>
                  <th>Státusz</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link className="code" href={`/internal/orders/${order.id}`}>
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td>{order.partnerName}</td>
                    <td>{order.requestedDeliveryDate}</td>
                    <td>{order.totalCartons}</td>
                    <td>{order.totalUnits.toLocaleString('hu-HU')}</td>
                    <td>{money(order.netTotalHuf)}</td>
                    <td>{money(order.vatTotalHuf)}</td>
                    <td><strong>{money(order.grossTotalHuf)}</strong></td>
                    <td>
                      {order.paymentMethod
                        ? paymentLabels[order.paymentMethod]
                        : '—'}
                    </td>
                    <td>
                      <span className={`badge badge-order-${order.status}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            Még nincs partner által beküldött rendelés.
          </div>
        )}

        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          path="/internal/orders"
          query={{ q, status }}
        />
      </section>
    </>
  );
}
