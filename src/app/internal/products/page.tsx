import type { ProductDto } from '@/contracts';
import { apiFetch } from '@/lib/api/server';
import { ProductEditForm } from './product-edit-form';

export const metadata = { title: 'Termékek' };

function money(value: number) {
  return `${value.toLocaleString('hu-HU')} Ft`;
}

function ProductTable({
  title,
  products,
}: {
  title: string;
  products: ProductDto[];
}) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Termék</th>
              <th>Kód</th>
              <th>Karton</th>
              <th>Nettó darabár</th>
              <th>Nettó kartonár</th>
              <th>Áfa</th>
              <th>Beállítás</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.flavorName}</strong>
                  <div className="muted small">{product.sizeMl} ml</div>
                </td>
                <td className="code">{product.code}</td>
                <td>{product.unitsPerCarton} db</td>
                <td>{money(product.netUnitPriceHuf)} + áfa</td>
                <td>{money(product.netCartonPriceHuf)} + áfa</td>
                <td>{product.vatRateBps / 100}%</td>
                <td>
                  <ProductEditForm product={product} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default async function ProductsPage() {
  const products = await apiFetch<ProductDto[]>('/products');
  const size150 = products.filter((product) => product.sizeMl === 150);
  const size300 = products.filter((product) => product.sizeMl === 300);

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Termékek</h1>
          <div className="muted small">
            A rendelési katalógus 16 termékváltozata. Az árváltozás a korábbi
            rendeléseket nem módosítja.
          </div>
        </div>
      </header>

      <div className="grid-4 stats-spacing">
        <div className="stat">
          <div className="stat-label">Aktív termékek</div>
          <div className="stat-value">
            {products.filter((product) => product.active).length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">150 ml karton</div>
          <div className="stat-value">20 db</div>
        </div>
        <div className="stat">
          <div className="stat-label">300 ml karton</div>
          <div className="stat-value">10 db</div>
        </div>
        <div className="stat">
          <div className="stat-label">Áfakulcs</div>
          <div className="stat-value">27%</div>
        </div>
      </div>

      <ProductTable title="150 ml" products={size150} />
      <ProductTable title="300 ml" products={size300} />
    </>
  );
}
