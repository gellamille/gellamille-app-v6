'use client';

import { useActionState } from 'react';
import type { ProductDto } from '@/contracts';
import { SubmitButton } from '@/components/submit-button';
import { initialActionState } from '@/lib/action-state';
import { updateProductAction } from './actions';

export function ProductEditForm({ product }: { product: ProductDto }) {
  const [state, action] = useActionState(
    updateProductAction,
    initialActionState,
  );

  return (
    <form action={action} className="product-edit-form">
      <input type="hidden" name="id" value={product.id} />
      <input type="hidden" name="version" value={product.version} />

      <div>
        <label htmlFor={`price-${product.id}`}>Nettó darabár</label>
        <input
          id={`price-${product.id}`}
          name="netUnitPriceHuf"
          type="number"
          min={1}
          defaultValue={product.netUnitPriceHuf}
          required
        />
      </div>

      <div>
        <label htmlFor={`sort-${product.id}`}>Sorrend</label>
        <input
          id={`sort-${product.id}`}
          name="sortOrder"
          type="number"
          min={0}
          defaultValue={product.sortOrder}
          required
        />
      </div>

      <label className="checkbox-field">
        <input
          name="active"
          type="checkbox"
          defaultChecked={product.active}
        />
        Rendelhető
      </label>

      <SubmitButton className="button button-primary button-small">
        Mentés
      </SubmitButton>

      {state.message ? (
        <div
          className={
            state.ok ? 'inline-success product-form-message' : 'inline-error product-form-message'
          }
        >
          {state.message}
        </div>
      ) : null}
    </form>
  );
}
