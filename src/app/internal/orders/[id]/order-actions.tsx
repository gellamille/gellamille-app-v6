'use client';

import { useActionState } from 'react';
import type { OrderStatus } from '@/contracts';
import { SubmitButton } from '@/components/submit-button';
import { initialActionState } from '@/lib/action-state';
import {
  rejectOrderAction,
  transitionOrderAction,
  voidOrderAction,
} from './actions';

function StatusForm({
  id,
  targetStatus,
  label,
}: {
  id: string;
  targetStatus: 'approved' | 'stock_shortage' | 'allocating';
  label: string;
}) {
  const [state, action] = useActionState(
    transitionOrderAction,
    initialActionState,
  );

  return (
    <form action={action} className="order-action-form">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="targetStatus" value={targetStatus} />
      <SubmitButton>{label}</SubmitButton>
      {state.message ? (
        <span className={state.ok ? 'inline-success' : 'inline-error'}>
          {state.message}
        </span>
      ) : null}
    </form>
  );
}

function ReasonForm({
  id,
  mode,
}: {
  id: string;
  mode: 'reject' | 'void';
}) {
  const [state, action] = useActionState(
    mode === 'reject' ? rejectOrderAction : voidOrderAction,
    initialActionState,
  );

  return (
    <form action={action} className="reason-action-form">
      <input type="hidden" name="id" value={id} />
      <input
        name="reason"
        minLength={5}
        required
        placeholder={
          mode === 'reject'
            ? 'Elutasítás indoka'
            : 'Sztornózás indoka'
        }
      />
      <SubmitButton
        className={
          mode === 'reject'
            ? 'button button-secondary'
            : 'button button-danger'
        }
      >
        {mode === 'reject' ? 'Elutasítás' : 'Sztornózás'}
      </SubmitButton>
      {state.message ? (
        <span className={state.ok ? 'inline-success' : 'inline-error'}>
          {state.message}
        </span>
      ) : null}
    </form>
  );
}

export function OrderActions({
  id,
  status,
}: {
  id: string;
  status: OrderStatus;
}) {
  return (
    <section className="card">
      <h2>Rendelés kezelése</h2>
      <div className="actions order-actions">
        {status === 'submitted' ? (
          <>
            <StatusForm id={id} targetStatus="approved" label="Jóváhagyás" />
            <StatusForm
              id={id}
              targetStatus="stock_shortage"
              label="Készlethiányos"
            />
          </>
        ) : null}

        {status === 'approved' || status === 'stock_shortage' ? (
          <StatusForm
            id={id}
            targetStatus="allocating"
            label="LOT-kiosztás indítása"
          />
        ) : null}
      </div>

      {['submitted', 'approved', 'stock_shortage'].includes(status) ? (
        <div className="order-reason-grid">
          <ReasonForm id={id} mode="reject" />
          <ReasonForm id={id} mode="void" />
        </div>
      ) : null}
    </section>
  );
}
