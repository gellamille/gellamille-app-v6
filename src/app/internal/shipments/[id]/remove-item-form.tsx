'use client';

import { useActionState } from 'react';
import { initialActionState } from '@/lib/action-state';
import { removeShipmentItemAction } from '../actions';

export function RemoveItemForm({ shipmentId, itemId }: { shipmentId: string; itemId: string }) {
  const [state, action] = useActionState(removeShipmentItemAction, initialActionState);
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm('Biztos, hogy eltávolítod ezt a LOT-ot a szállítmányból?')) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="shipmentId" value={shipmentId} />
      <input type="hidden" name="itemId" value={itemId} />
      <button className="button button-danger button-small" type="submit">Törlés</button>
      {state.message ? (
        <div className={state.ok ? 'inline-success' : 'inline-error'}>{state.message}</div>
      ) : null}
    </form>
  );
}
