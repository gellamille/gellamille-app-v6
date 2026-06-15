import Link from 'next/link';
import type { LotDto } from '@/contracts';
import { apiFetch } from '@/lib/api/server';
import { VoidLotButton } from '../void-lot-button';

type LotAllocation = {
  shipmentItemId: string;
  shipmentId: string;
  shipmentNumber: string;
  partnerName: string;
  shipmentStatus: string;
  quantity: number;
};

type LotDetail = LotDto & { allocations: LotAllocation[] };

const shipmentStatusLabels: Record<string, string> = {
  draft: 'Piszkozat',
  closed: 'Lezárt',
  shipped: 'Kiszállítva',
  void: 'Sztornózott',
};

export default async function LotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lot = await apiFetch<LotDetail>(`/lots/${id}`);
  const reserved = lot.allocations
    .filter((item) => item.shipmentStatus === 'draft' || item.shipmentStatus === 'closed')
    .reduce((sum, item) => sum + item.quantity, 0);
  const shipped = lot.allocations
    .filter((item) => item.shipmentStatus === 'shipped')
    .reduce((sum, item) => sum + item.quantity, 0);
  const available = Math.max(lot.quantity - reserved - shipped, 0);

  return (
    <>
      <header className="topbar">
        <div>
          <h1 className="code">{lot.lotNumber}</h1>
          <div className="muted small">{lot.flavorName} · {lot.sizeMl} ml</div>
        </div>
        <div className="topbar-actions">
          <span className={`badge badge-${lot.status}`}>
            {lot.status === 'active' ? 'Aktív' : 'Sztornózott'}
          </span>
          <Link className="button button-secondary" href="/internal/lots">Vissza</Link>
        </div>
      </header>

      {lot.status === 'void' && lot.voidReason ? (
        <div className="alert alert-error">Sztornózás indoka: {lot.voidReason}</div>
      ) : null}

      <section className="card">
        <div className="grid-4">
          <div className="stat"><div className="stat-label">Gyártott</div><div className="stat-value">{lot.quantity.toLocaleString('hu-HU')}</div></div>
          <div className="stat"><div className="stat-label">Lefoglalt</div><div className="stat-value">{reserved.toLocaleString('hu-HU')}</div></div>
          <div className="stat"><div className="stat-label">Kiszállított</div><div className="stat-value">{shipped.toLocaleString('hu-HU')}</div></div>
          <div className="stat"><div className="stat-label">Elérhető</div><div className="stat-value">{available.toLocaleString('hu-HU')}</div></div>
        </div>
        <div className="grid-3 detail-grid-spacing">
          <div className="detail-box"><span>Gyártás</span><strong>{lot.productionDate} · {lot.productionPeriod === 'AM' ? 'Délelőtt' : 'Délután'}</strong></div>
          <div className="detail-box"><span>Lejárat</span><strong>{lot.bestBefore}</strong></div>
          <div className="detail-box"><span>Felelős</span><strong>{lot.operatorName}</strong></div>
          <div className="detail-box"><span>Ízkód</span><strong>{lot.flavorCode}</strong></div>
          <div className="detail-box"><span>Éves sorszám</span><strong>{String(lot.batchNo).padStart(4, '0')}</strong></div>
          <div className="detail-box"><span>Létrehozás</span><strong>{new Date(lot.createdAt).toLocaleString('hu-HU')}</strong></div>
          <div className="detail-box full"><span>Megjegyzés</span><strong>{lot.note || '—'}</strong></div>
        </div>
        {lot.status === 'active' ? (
          <div className="actions"><VoidLotButton id={lot.id} lotNumber={lot.lotNumber} /></div>
        ) : null}
      </section>

      <section className="card">
        <h2>Kapcsolódó szállítmányok</h2>
        {lot.allocations.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Szállítmány</th><th>Partner</th><th>Státusz</th><th>Darabszám</th></tr></thead>
              <tbody>
                {lot.allocations.map((allocation) => (
                  <tr key={allocation.shipmentItemId} className={allocation.shipmentStatus === 'void' ? 'row-void' : undefined}>
                    <td><Link className="code" href={`/internal/shipments/${allocation.shipmentId}`}>{allocation.shipmentNumber}</Link></td>
                    <td>{allocation.partnerName}</td>
                    <td><span className={`badge badge-${allocation.shipmentStatus}`}>{shipmentStatusLabels[allocation.shipmentStatus] ?? allocation.shipmentStatus}</span></td>
                    <td>{allocation.quantity.toLocaleString('hu-HU')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="empty">Ez a LOT még nincs szállítmányhoz rendelve.</div>}
      </section>
    </>
  );
}
