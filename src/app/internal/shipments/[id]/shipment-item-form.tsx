'use client';

import { useActionState } from 'react';
import { SubmitButton } from '@/components/submit-button';
import { initialActionState } from '@/lib/action-state';
import { setShipmentItemAction } from '../actions';

export function ShipmentItemForm({
  shipmentId,
  lotId,
  defaultQuantity,
  maximum,
}: {
  shipmentId: string;
  lotId: string;
  defaultQuantity?: number;
  maximum: number;
}) {
  const [state, action] = useActionState(setShipmentItemAction, initialActionState);

  return (
    <form action={action} className="inline-form">
      <input type="hidden" name="shipmentId" value={shipmentId} />
      <input type="hidden" name="lotId" value={lotId} />
      <input
        aria-label="Hozzárendelt darabszám"
        name="quantity"
        type="number"
        min={1}
        max={maximum}
        defaultValue={defaultQuantity || ''}
        required
      />
      <SubmitButton className="button button-primary button-small">Beállítás</SubmitButton>
      {state.message ? (
        <span className={state.ok ? 'inline-success' : 'inline-error'}>{state.message}</span>
      ) : null}
    </form>
  );
}
