import Link from 'next/link';
import type {
  OrderDto,
  OrderItemDto,
  OrderStatus,
} from '@/contracts';
import { apiFetch } from '@/lib/api/server';
import { ClearPartnerCart } from './clear-cart';

type OrderDetail = OrderDto & {
  items: OrderItemDto[];
};

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
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [{ id }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const order = await apiFetch<OrderDetail>(
    `/partner-portal/orders/${id}`,
  );

  return (
    <>
      {query.created === '1' ? <ClearPartnerCart /> : null}

      <header className="page-heading">
        <div>
          <h1>{order.orderNumber}</h1>
          <p>
            Kért szállítás: {order.requestedDeliveryDate}
          </p>
        </div>
        <span className={`status status-${order.status}`}>
          {statusLabels[order.status]}
        </span>
      </header>

      {query.created === '1' ? (
        <div className="success-panel">
          A rendelésedet sikeresen rögzítettük.
        </div>
      ) : null}

      <div className="order-detail-grid">
        <section className="portal-card">
          <h2>Rendelt termékek</h2>
          <div className="detail-items">
            {order.items.map((item) => (
              <div className="detail-item" key={item.id}>
                <div>
                  <strong>{item.productName}</strong>
                  <span>
                    {item.sizeMl} ml · {item.cartons} karton ·{' '}
                    {item.unitQuantity} db
                  </span>
                </div>
                <div>
                  <span>{money(item.netTotalHuf)} + áfa</span>
                  <strong>{money(item.grossTotalHuf)}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="portal-card order-summary-card">
          <h2>Összesítés</h2>
          <dl>
            <div>
              <dt>Kartonok</dt>
              <dd>{order.totalCartons}</dd>
            </div>
            <div>
              <dt>Darabszám</dt>
              <dd>{order.totalUnits.toLocaleString('hu-HU')}</dd>
            </div>
            <div>
              <dt>Nettó</dt>
              <dd>{money(order.netTotalHuf)}</dd>
            </div>
            <div>
              <dt>Áfa</dt>
              <dd>{money(order.vatTotalHuf)}</dd>
            </div>
            <div className="gross-row">
              <dt>Bruttó</dt>
              <dd>{money(order.grossTotalHuf)}</dd>
            </div>
          </dl>

          <div className="summary-block">
            <span>Fizetési mód</span>
            <strong>
              {order.paymentMethod
                ? paymentLabels[order.paymentMethod]
                : '—'}
            </strong>
          </div>

          {order.note ? (
            <div className="summary-block">
              <span>Megjegyzés</span>
              <strong>{order.note}</strong>
            </div>
          ) : null}

          {order.rejectionReason || order.voidReason ? (
            <div className="alert alert-error">
              {order.rejectionReason || order.voidReason}
            </div>
          ) : null}
        </aside>
      </div>

      <div className="page-actions">
        <Link className="button button-secondary" href="/partner/orders">
          Vissza a rendelésekhez
        </Link>
        <Link className="button button-primary" href="/partner/catalog">
          Új rendelés
        </Link>
      </div>
    </>
  );
}
