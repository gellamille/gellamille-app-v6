'use client';

import { useActionState, useEffect, useState } from 'react';
import { initialActionState } from '@/lib/action-state';
import { SubmitButton } from '@/components/submit-button';
import { voidLotAction } from './actions';

export function VoidLotButton({ id, lotNumber }: { id: string; lotNumber: string }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(voidLotAction, initialActionState);

  useEffect(() => {
    if (state.ok) setOpen(false);
  }, [state.ok]);

  return (
    <>
      <button className="button button-danger button-small" type="button" onClick={() => setOpen(true)}>Sztornózás</button>
      {open ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h2>{lotNumber} sztornózása</h2>
            <form action={action}>
              <input type="hidden" name="id" value={id} />
              <label className="required" htmlFor={`reason-${id}`}>Indoklás</label>
              <textarea id={`reason-${id}`} name="reason" minLength={5} maxLength={500} required />
              {state.message ? <div className={`alert ${state.ok ? 'alert-success' : 'alert-error'}`}>{state.message}</div> : null}
              <div className="actions">
                <button className="button button-secondary" type="button" onClick={() => setOpen(false)}>Mégse</button>
                <SubmitButton className="button button-danger">LOT sztornózása</SubmitButton>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
