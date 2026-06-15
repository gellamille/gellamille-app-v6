import Link from 'next/link';
import type { OrderDto, OrderStatus } from '@/contracts';
import { apiFetch } from '@/lib/api/server';
import { OrderActions } from './order-actions';

type OrderDetail = OrderDto & {
  partner: {
    id: string;
    name: string;
    shippingAddress: string | null;
    contactName: string | null;
    email: string | null;
    phone: string | null;
  };
};

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
  cash_on_delivery: 'Helyszínen készpénzben',
  card_on_delivery: 'Helyszínen bankkártyával',
  bank_transfer: 'Banki átutalással',
};

function money(value: number) {
  return `${value.toLocaleString('hu-HU')} Ft`;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await apiFetch<OrderDetail>(`/orders/${id}`);

  return (
    <>
      <header className="topbar">
        <div>
          <h1>{order.orderNumber}</h1>
          <div className="muted small">
            {order.partnerName} · {order.requestedDeliveryDate}
          </div>
        </div>
        <div className="topbar-actions">
          <span className={`badge badge-order-${order.status}`}>
            {statusLabels[order.status]}
          </span>
          <Link className="button button-secondary" href="/internal/orders">
            Vissza
          </Link>
        </div>
      </header>

      <div className="grid-4 stats-spacing">
        <div className="stat">
          <div className="stat-label">Karton</div>
          <div className="stat-value">{order.totalCartons}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Darabszám</div>
          <div className="stat-value">
            {order.totalUnits.toLocaleString('hu-HU')}
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">Nettó</div>
          <div className="stat-value order-money">
            {money(order.netTotalHuf)}
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">Bruttó</div>
          <div className="stat-value order-money">
            {money(order.grossTotalHuf)}
          </div>
        </div>
      </div>

      <section className="card">
        <h2>Rendelési adatok</h2>
        <div className="grid-3">
          <div className="detail-box">
            <span>Partner</span>
            <strong>{order.partnerName}</strong>
          </div>
          <div className="detail-box">
            <span>Kért szállítási nap</span>
            <strong>{order.requestedDeliveryDate}</strong>
          </div>
          <div className="detail-box">
            <span>Fizetési mód</span>
            <strong>
              {order.paymentMethod
                ? paymentLabels[order.paymentMethod]
                : '—'}
            </strong>
          </div>
          <div className="detail-box">
            <span>Áfa</span>
            <strong>{money(order.vatTotalHuf)}</strong>
          </div>
          <div className="detail-box">
            <span>Kapcsolattartó</span>
            <strong>{order.partner.contactName || '—'}</strong>
          </div>
          <div className="detail-box">
            <span>Megjegyzés</span>
            <strong>{order.note || '—'}</strong>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Rendelt tételek</h2>
        {order.items?.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Termék</th>
                  <th>Méret</th>
                  <th>Karton</th>
                  <th>Darab</th>
                  <th>Egységár</th>
                  <th>Nettó</th>
                  <th>Áfa</th>
                  <th>Bruttó</th>
                  <th>LOT-kiosztás</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.productName}</strong>
                      <div className="code small">{item.productCode}</div>
                    </td>
                    <td>{item.sizeMl} ml</td>
                    <td>{item.cartons}</td>
                    <td>{item.unitQuantity}</td>
                    <td>{money(item.netUnitPriceHuf)} + áfa</td>
                    <td>{money(item.netTotalHuf)}</td>
                    <td>{money(item.vatTotalHuf)}</td>
                    <td><strong>{money(item.grossTotalHuf)}</strong></td>
                    <td>
                      {(item.allocatedQuantity ?? 0).toLocaleString('hu-HU')}
                      {' / '}
                      {item.unitQuantity.toLocaleString('hu-HU')} db
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">A rendelésnek nincs tétele.</div>
        )}
      </section>

      <OrderActions id={order.id} status={order.status} />

      {order.rejectionReason || order.voidReason ? (
        <section className="card">
          <h2>Indoklás</h2>
          <div className="alert alert-warning">
            {order.rejectionReason || order.voidReason}
          </div>
        </section>
      ) : null}
    </>
  );
}
