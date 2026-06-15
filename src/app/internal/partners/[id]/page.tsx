import Link from 'next/link';
import type { PartnerDeliveryDayDto, PartnerDto, ShipmentDto } from '@/contracts';
import { apiFetch } from '@/lib/api/server';
import { DeliveryDaysForm } from './delivery-days-form';

type PartnerDetail = PartnerDto & { shipments: ShipmentDto[]; deliveryDays: PartnerDeliveryDayDto[] };


const statusLabels: Record<string, string> = {
  draft: 'Piszkozat',
  closed: 'Lezárt',
  shipped: 'Kiszállítva',
  void: 'Sztornózott',
};

export default async function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const partner = await apiFetch<PartnerDetail>(`/partners/${id}`);
  return (
    <>
      <header className="topbar"><div><h1>{partner.name}</h1><div className="muted small">Partner adatlap</div></div><Link className="button button-secondary" href="/internal/partners">Vissza</Link></header>
      <section className="card">
        <div className="grid-3">
          {[['Számlázási név', partner.billingName], ['Adószám', partner.taxNumber], ['Szállítási cím', partner.shippingAddress], ['Kapcsolattartó', partner.contactName], ['E-mail', partner.email], ['Telefonszám', partner.phone], ['Megjegyzés', partner.note], ['Státusz', partner.active ? 'Aktív' : 'Inaktív']].map(([label, value]) => <div className="stat" key={label}><div className="stat-label">{label}</div><div className="stat-content">{value || '—'}</div></div>)}
        </div>
      </section>
      <section className="card">
        <h2>Heti szállítási napok</h2>
        <div className="muted small">
          A partneri rendelési naptár csak az itt engedélyezett napokat fogja mutatni.
        </div>
        <div className="detail-grid-spacing">
          <DeliveryDaysForm partnerId={partner.id} deliveryDays={partner.deliveryDays ?? []} />
        </div>
      </section>
      <section className="card"><h2>Szállítmányok</h2>{partner.shipments?.length ? <div className="table-wrap"><table><thead><tr><th>Szállítmány</th><th>Dátum</th><th>Státusz</th><th>LOT</th><th>Darabszám</th></tr></thead><tbody>{partner.shipments.map((shipment) => <tr key={shipment.id}><td><Link className="code" href={`/internal/shipments/${shipment.id}`}>{shipment.shipmentNumber}</Link></td><td>{shipment.shipmentDate}</td><td><span className={`badge badge-${shipment.status}`}>{statusLabels[shipment.status] ?? shipment.status}</span></td><td>{shipment.lotCount}</td><td>{shipment.units.toLocaleString('hu-HU')}</td></tr>)}</tbody></table></div> : <div className="empty">Nincs szállítmány.</div>}</section>
    </>
  );
}
