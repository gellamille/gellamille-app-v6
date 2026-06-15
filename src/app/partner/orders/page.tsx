import Link from 'next/link';
import type {
  OrderDto,
  OrderStatus,
} from '@/contracts';
import { apiFetch } from '@/lib/api/server';

export const metadata = { title: 'Rendeléseim' };

const statusLabels: Record<OrderStatus, string> = {
  draft: 'Piszkozat',
  submitted: 'Beküldve',
  approved: 'Jóváhagyva',
  stock_shortage: 'Egyeztetés szükséges',
  allocating: 'Összekészítés alatt',
  shipment_created: 'Szállításra előkészítve',
  shipped: 'Kiszállítva',
  rejected: 'Elutasítva',
  void: 'Sztornózott',
};

function money(value: number) {
  return `${value.toLocaleString('hu-HU')} Ft`;
}

export default async function OrdersPage() {
  const orders = await apiFetch<OrderDto[]>(
    '/partner-portal/orders',
  );

  return (
    <>
      <header className="page-heading">
        <div>
          <h1>Rendeléseim</h1>
          <p>A saját korábbi és folyamatban lévő rendeléseid.</p>
        </div>
        <Link className="button button-primary" href="/partner/catalog">
          Új rendelés
        </Link>
      </header>

      <section className="portal-card">
        {orders.length ? (
          <div className="order-history">
            {orders.map((order) => (
              <Link
                href={`/orders/${order.id}`}
                className="history-card"
                key={order.id}
              >
                <div>
                  <span className="order-number">
                    {order.orderNumber}
                  </span>
                  <strong>{order.requestedDeliveryDate}</strong>
                  <span>
                    {order.totalCartons} karton ·{' '}
                    {order.totalUnits.toLocaleString('hu-HU')} db
                  </span>
                </div>

                <div className="history-summary">
                  <span className={`status status-${order.status}`}>
                    {statusLabels[order.status]}
                  </span>
                  <strong>{money(order.grossTotalHuf)}</strong>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Még nincs rendelésed</h2>
            <p>Az első rendelésedet a termékkatalógusból adhatod le.</p>
            <Link className="button button-primary" href="/partner/catalog">
              Rendelés indítása
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
