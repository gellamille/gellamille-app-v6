'use client';

import { useActionState, useState } from 'react';
import type { ShipmentStatus } from '@/contracts';
import { SubmitButton } from '@/components/submit-button';
import { initialActionState } from '@/lib/action-state';
import { transitionShipmentAction, voidShipmentAction } from '../actions';

export function ShipmentActions({
  shipmentId,
  shipmentNumber,
  status,
}: {
  shipmentId: string;
  shipmentNumber: string;
  status: ShipmentStatus;
}) {
  const [voidOpen, setVoidOpen] = useState(false);
  const [transitionState, transitionAction] = useActionState(transitionShipmentAction, initialActionState);
  const [voidState, voidAction] = useActionState(voidShipmentAction, initialActionState);

  return (
    <>
      <div className="actions no-margin">
        {status === 'draft' ? (
          <form
            action={transitionAction}
            onSubmit={(event) => {
              if (!window.confirm('Biztos, hogy lezárod a szállítmányt? Ezután a LOT-ok nem módosíthatók.')) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="shipmentId" value={shipmentId} />
            <input type="hidden" name="targetStatus" value="closed" />
            <button className="button button-primary" type="submit">Szállítmány lezárása</button>
          </form>
        ) : null}

        {status === 'closed' ? (
          <form
            action={transitionAction}
            onSubmit={(event) => {
              if (!window.confirm('Biztos, hogy kiszállítottnak jelölöd a szállítmányt?')) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="shipmentId" value={shipmentId} />
            <input type="hidden" name="targetStatus" value="shipped" />
            <button className="button button-success" type="submit">Kiszállítottnak jelölés</button>
          </form>
        ) : null}

        {status === 'draft' || status === 'closed' ? (
          <button className="button button-danger" type="button" onClick={() => setVoidOpen(true)}>
            Sztornózás
          </button>
        ) : null}
      </div>
      {transitionState.message ? (
        <div className={`alert ${transitionState.ok ? 'alert-success' : 'alert-error'}`}>
          {transitionState.message}
        </div>
      ) : null}

      {voidOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="void-shipment-title">
          <div className="modal">
            <h2 id="void-shipment-title">Szállítmány sztornózása</h2>
            <div className="alert alert-warning">
              <strong>{shipmentNumber}</strong><br />
              A lefoglalt készlet felszabadul. Kiszállított szállítmány nem sztornózható.
            </div>
            <form action={voidAction}>
              <input type="hidden" name="shipmentId" value={shipmentId} />
              <label className="required" htmlFor="voidReason">Sztornózás indoka</label>
              <textarea id="voidReason" name="reason" minLength={5} maxLength={500} required autoFocus />
              {voidState.message ? (
                <div className={`alert ${voidState.ok ? 'alert-success' : 'alert-error'}`}>
                  {voidState.message}
                </div>
              ) : null}
              <div className="actions">
                <button className="button button-secondary" type="button" onClick={() => setVoidOpen(false)}>
                  Mégse
                </button>
                <SubmitButton className="button button-danger">Szállítmány sztornózása</SubmitButton>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
