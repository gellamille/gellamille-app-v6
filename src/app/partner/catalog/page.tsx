import type { PartnerPortalBootstrapDto } from '@/contracts';
import { apiFetch } from '@/lib/api/server';
import { OrderCatalog } from './order-catalog';

export const metadata = { title: 'Új rendelés' };

export default async function CatalogPage() {
  const bootstrap =
    await apiFetch<PartnerPortalBootstrapDto>(
      '/partner-portal/bootstrap',
    );

  return (
    <>
      <header className="page-heading">
        <div>
          <h1>Új rendelés</h1>
          <p>
            Válaszd ki a szükséges kartonokat. A minimum rendelés
            {` ${bootstrap.minimumOrderCartons} karton.`}
          </p>
        </div>
        <div className="partner-chip">
          {bootstrap.profile.partnerName}
        </div>
      </header>

      <OrderCatalog
        products={bootstrap.products}
        deliveryDates={bootstrap.deliveryDates}
        minimumOrderCartons={bootstrap.minimumOrderCartons}
      />
    </>
  );
}
