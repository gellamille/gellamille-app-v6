import Link from 'next/link';
import type {
  PartnerDto,
  ShipmentAvailableLotDto,
  ShipmentDto,
  ShipmentItemDto,
} from '@/contracts';
import { apiFetch } from '@/lib/api/server';
import { RemoveItemForm } from './remove-item-form';
import { ShipmentActions } from './shipment-actions';
import { ShipmentItemForm } from './shipment-item-form';

type ShipmentEvent = {
  id: string;
  eventType: string;
  reason: string | null;
  createdAt: string;
};

type ShipmentDetail = ShipmentDto & {
  partner: PartnerDto;
  items: ShipmentItemDto[];
  events: ShipmentEvent[];
};

const statusLabels: Record<string, string> = {
  draft: 'Piszkozat',
  closed: 'Lezárt',
  shipped: 'Kiszállítva',
  void: 'Sztornózott',
};

const eventLabels: Record<string, string> = {
  created: 'Létrehozva',
  item_set: 'LOT beállítva',
  item_removed: 'LOT eltávolítva',
  closed: 'Lezárva',
  shipped: 'Kiszállítva',
  voided: 'Sztornózva',
};

export default async function ShipmentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const filters = await searchParams;
  const q = typeof filters.q === 'string' ? filters.q : '';
  const availableQuery = new URLSearchParams();
  if (q) availableQuery.set('q', q);

  const shipment = await apiFetch<ShipmentDetail>(`/shipments/${id}`);
  const availableLots = shipment.status === 'draft'
    ? await apiFetch<ShipmentAvailableLotDto[]>(
        `/shipments/${id}/available-lots?${availableQuery.toString()}`,
      )
    : [];

  return (
    <>
      <header className="topbar">
        <div>
          <h1>{shipment.shipmentNumber}</h1>
          <div className="muted small">{shipment.partnerName} · {shipment.shipmentDate}</div>
        </div>
        <div className="topbar-actions">
          <span className={`badge badge-${shipment.status}`}>
            {statusLabels[shipment.status] ?? shipment.status}
          </span>
          <Link className="button button-secondary" href="/internal/shipments">Vissza</Link>
        </div>
      </header>

      {shipment.status === 'void' && shipment.voidReason ? (
        <div className="alert alert-error">Sztornózás indoka: {shipment.voidReason}</div>
      ) : null}

      <section className="card">
        <div className="grid-4">
          <div className="stat"><div className="stat-label">Partner</div><div className="stat-content">{shipment.partnerName}</div></div>
          <div className="stat"><div className="stat-label">LOT-ok</div><div className="stat-content">{shipment.lotCount}</div></div>
          <div className="stat"><div className="stat-label">Darabszám</div><div className="stat-content">{shipment.units.toLocaleString('hu-HU')} db</div></div>
          <div className="stat"><div className="stat-label">Szállítás</div><div className="stat-content">{shipment.shipmentDate}</div></div>
        </div>
        <div className="grid-3 detail-grid-spacing">
          <div className="detail-box"><span>Szállítási cím</span><strong>{shipment.shippingAddress || '—'}</strong></div>
          <div className="detail-box"><span>Partner rendelési száma</span><strong>{shipment.customerOrderNumber || '—'}</strong></div>
          <div className="detail-box"><span>Szállítólevél</span><strong>{shipment.deliveryNoteNumber || '—'}</strong></div>
          <div className="detail-box full"><span>Megjegyzés</span><strong>{shipment.note || '—'}</strong></div>
        </div>
        <ShipmentActions shipmentId={shipment.id} shipmentNumber={shipment.shipmentNumber} status={shipment.status} />
      </section>

      <div className="grid-2 shipment-detail-grid">
        <section className="card">
          <div className="toolbar">
            <div>
              <h2>Elérhető LOT-ok</h2>
              <div className="muted small">FEFO szerint, a leghamarabb lejáró tételekkel kezdve.</div>
            </div>
            <form method="get" className="toolbar-group">
              <div>
                <label htmlFor="q">Keresés</label>
                <input id="q" name="q" defaultValue={q} placeholder="LOT vagy termék" />
              </div>
              <button className="button button-secondary" type="submit">Keresés</button>
            </form>
          </div>

          {shipment.status !== 'draft' ? (
            <div className="alert alert-warning">Csak piszkozat állapotban módosítható a tartalom.</div>
          ) : null}

          {availableLots.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>LOT</th><th>Termék</th><th>Lejárat</th><th>Elérhető</th><th>Hozzárendelés</th></tr>
                </thead>
                <tbody>
                  {availableLots.map((lot) => {
                    const maximum = lot.availableForShipment;
                    return (
                      <tr key={lot.id}>
                        <td className="code">{lot.lotNumber}</td>
                        <td>{lot.flavorName}<div className="muted small">{lot.sizeMl} ml</div></td>
                        <td>{lot.bestBefore}</td>
                        <td>{maximum.toLocaleString('hu-HU')}</td>
                        <td>
                          {shipment.status === 'draft' ? (
                            <ShipmentItemForm
                              shipmentId={shipment.id}
                              lotId={lot.id}
                              defaultQuantity={lot.currentQuantity}
                              maximum={maximum}
                            />
                          ) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty">Nincs elérhető LOT.</div>
          )}
        </section>

        <section className="card">
          <h2>Szállítmány tartalma</h2>
          {shipment.items.length ? (
            <div className="table-wrap">
              <table>
                <thead><tr><th>LOT</th><th>Termék</th><th>Db</th><th>Művelet</th></tr></thead>
                <tbody>
                  {shipment.items.map((item) => (
                    <tr key={item.id}>
                      <td className="code">{item.lotNumber}</td>
                      <td>{item.flavorName}<div className="muted small">{item.sizeMl} ml · {item.bestBefore}</div></td>
                      <td>{item.quantity.toLocaleString('hu-HU')}</td>
                      <td>
                        {shipment.status === 'draft' ? (
                          <RemoveItemForm shipmentId={shipment.id} itemId={item.id} />
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty">Még nincs LOT hozzárendelve.</div>
          )}
        </section>
      </div>

      <section className="card">
        <h2>Eseménynapló</h2>
        {shipment.events.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Időpont</th><th>Esemény</th><th>Indok</th></tr></thead>
              <tbody>
                {shipment.events.map((event) => (
                  <tr key={event.id}>
                    <td>{new Date(event.createdAt).toLocaleString('hu-HU')}</td>
                    <td>{eventLabels[event.eventType] ?? event.eventType}</td>
                    <td>{event.reason || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="empty">Nincs naplóbejegyzés.</div>}
      </section>
    </>
  );
}
