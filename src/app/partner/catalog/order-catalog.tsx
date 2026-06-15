'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
import type {
  DeliveryDateOptionDto,
  ProductDto,
} from '@/contracts';
import { SubmitButton } from '@/components/submit-button';
import { initialActionState } from '@/lib/action-state';
import { createOrderAction } from './actions';

const CART_KEY = 'gellamille-partner-cart-v1';

function money(value: number) {
  return `${value.toLocaleString('hu-HU')} Ft`;
}

export function OrderCatalog({
  products,
  deliveryDates,
  minimumOrderCartons,
}: {
  products: ProductDto[];
  deliveryDates: DeliveryDateOptionDto[];
  minimumOrderCartons: number;
}) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [offline, setOffline] = useState(false);
  const [state, action] = useActionState(
    createOrderAction,
    initialActionState,
  );

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, number>;
        const validIds = new Set(products.map((product) => product.id));
        setCart(
          Object.fromEntries(
            Object.entries(parsed).filter(
              ([id, cartons]) =>
                validIds.has(id) &&
                Number.isInteger(cartons) &&
                cartons > 0,
            ),
          ),
        );
      }
    } catch {
      window.localStorage.removeItem(CART_KEY);
    }

    const updateNetwork = () => setOffline(!navigator.onLine);
    updateNetwork();
    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);

    return () => {
      window.removeEventListener('online', updateNetwork);
      window.removeEventListener('offline', updateNetwork);
    };
  }, [products]);

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const totals = useMemo(() => {
    return products.reduce(
      (sum, product) => {
        const cartons = cart[product.id] ?? 0;
        const units = cartons * product.unitsPerCarton;
        const net = units * product.netUnitPriceHuf;
        const vat = Math.round(
          (net * product.vatRateBps) / 10000,
        );

        return {
          cartons: sum.cartons + cartons,
          units: sum.units + units,
          net: sum.net + net,
          vat: sum.vat + vat,
          gross: sum.gross + net + vat,
        };
      },
      { cartons: 0, units: 0, net: 0, vat: 0, gross: 0 },
    );
  }, [cart, products]);

  const items = products
    .filter((product) => (cart[product.id] ?? 0) > 0)
    .map((product) => ({
      productId: product.id,
      cartons: cart[product.id] ?? 0,
    }));

  const canSubmit =
    totals.cartons >= minimumOrderCartons &&
    deliveryDates.length > 0 &&
    !offline;

  function setCartons(productId: string, value: number) {
    const cartons = Math.max(0, Math.min(999, value));
    setCart((current) => {
      if (cartons === 0) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: cartons };
    });
  }

  function ProductSection({
    title,
    size,
  }: {
    title: string;
    size: 150 | 300;
  }) {
    const sectionProducts = products.filter(
      (product) => product.sizeMl === size,
    );

    return (
      <section className="catalog-section">
        <div className="section-heading">
          <div>
            <h2>{title}</h2>
            <p>
              {size === 150 ? '20 db' : '10 db'} termék egy kartonban
            </p>
          </div>
        </div>

        <div className="product-grid">
          {sectionProducts.map((product) => {
            const cartons = cart[product.id] ?? 0;
            return (
              <article
                className={`product-card ${cartons ? 'product-selected' : ''}`}
                key={product.id}
              >
                <div className="product-card-top">
                  <div>
                    <h3>{product.flavorName}</h3>
                    <div className="product-meta">
                      {product.sizeMl} ml · {product.unitsPerCarton} db/karton
                    </div>
                  </div>
                  <span className="product-code">{product.code}</span>
                </div>

                <div className="product-prices">
                  <strong>
                    {money(product.netUnitPriceHuf)} + áfa / db
                  </strong>
                  <span>
                    {money(product.netCartonPriceHuf)} + áfa / karton
                  </span>
                </div>

                <div className="quantity-control">
                  <button
                    type="button"
                    aria-label="Egy karton levonása"
                    onClick={() =>
                      setCartons(product.id, cartons - 1)
                    }
                  >
                    −
                  </button>
                  <input
                    aria-label={`${product.flavorName} kartonszám`}
                    type="number"
                    min={0}
                    max={999}
                    value={cartons}
                    onChange={(event) =>
                      setCartons(
                        product.id,
                        Number(event.target.value) || 0,
                      )
                    }
                  />
                  <button
                    type="button"
                    aria-label="Egy karton hozzáadása"
                    onClick={() =>
                      setCartons(product.id, cartons + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <form action={action} className="order-layout">
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(items)}
      />

      <div className="catalog-column">
        <ProductSection title="150 ml" size={150} />
        <ProductSection title="300 ml" size={300} />
      </div>

      <aside className="cart-panel">
        <div className="cart-sticky">
          <h2>Rendelés összesítő</h2>

          <div className="cart-totals">
            <div>
              <span>Kartonok</span>
              <strong>{totals.cartons}</strong>
            </div>
            <div>
              <span>Teljes darabszám</span>
              <strong>{totals.units.toLocaleString('hu-HU')}</strong>
            </div>
            <div>
              <span>Nettó</span>
              <strong>{money(totals.net)}</strong>
            </div>
            <div>
              <span>Áfa (27%)</span>
              <strong>{money(totals.vat)}</strong>
            </div>
            <div className="gross-row">
              <span>Bruttó végösszeg</span>
              <strong>{money(totals.gross)}</strong>
            </div>
          </div>

          <div
            className={
              totals.cartons >= minimumOrderCartons
                ? 'minimum-ok'
                : 'minimum-warning'
            }
          >
            Minimum rendelés: {minimumOrderCartons} karton
            {totals.cartons < minimumOrderCartons
              ? ` · még ${minimumOrderCartons - totals.cartons} karton szükséges`
              : ' · teljesítve'}
          </div>

          <div className="cart-field">
            <label className="required" htmlFor="delivery">
              Szállítási nap
            </label>
            <select
              id="delivery"
              name="requestedDeliveryDate"
              required
              defaultValue=""
              disabled={!deliveryDates.length}
            >
              <option value="" disabled>
                Válassz szállítási napot
              </option>
              {deliveryDates.map((option) => (
                <option key={option.date} value={option.date}>
                  {option.label}
                </option>
              ))}
            </select>
            {!deliveryDates.length ? (
              <p className="field-warning">
                Nincs beállított rendelhető szállítási nap. Keresd a
                kapcsolattartódat.
              </p>
            ) : null}
          </div>

          <div className="cart-field">
            <label className="required" htmlFor="payment">
              Fizetési mód
            </label>
            <select
              id="payment"
              name="paymentMethod"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Válassz fizetési módot
              </option>
              <option value="cash_on_delivery">
                Helyszínen készpénzben
              </option>
              <option value="card_on_delivery">
                Helyszínen bankkártyával
              </option>
              <option value="bank_transfer">
                Banki átutalással
              </option>
            </select>
          </div>

          <div className="cart-field">
            <label htmlFor="note">Megjegyzés</label>
            <textarea
              id="note"
              name="note"
              maxLength={1000}
              placeholder="Opcionális megjegyzés a rendeléshez"
            />
          </div>

          {offline ? (
            <div className="alert alert-error">
              Offline módban rendelés nem küldhető be.
            </div>
          ) : null}

          {state.message ? (
            <div className="alert alert-error">{state.message}</div>
          ) : null}

          <SubmitButton
            className="button button-primary checkout-button"
            disabled={!canSubmit}
          >
            Rendelés elküldése
          </SubmitButton>

          <p className="checkout-note">
            A beküldés után a rendelés a Gellamille belső rendszerében
            azonnal megjelenik.
          </p>
        </div>
      </aside>
    </form>
  );
}
