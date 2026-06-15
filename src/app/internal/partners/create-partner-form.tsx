'use client';

import { useActionState } from 'react';
import { SubmitButton } from '@/components/submit-button';
import { initialActionState } from '@/lib/action-state';
import { createPartnerAction } from './actions';

export function CreatePartnerForm({ idempotencyKey }: { idempotencyKey: string }) {
  const [state, action] = useActionState(createPartnerAction, initialActionState);
  return (
    <form action={action} className="form-grid">
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
      <div className="full"><label className="required" htmlFor="name">Partner neve</label><input id="name" name="name" required minLength={2} /></div>
      <div><label htmlFor="billingName">Számlázási név</label><input id="billingName" name="billingName" /></div>
      <div><label htmlFor="taxNumber">Adószám</label><input id="taxNumber" name="taxNumber" /></div>
      <div className="full"><label htmlFor="shippingAddress">Szállítási cím</label><textarea id="shippingAddress" name="shippingAddress" /></div>
      <div><label htmlFor="contactName">Kapcsolattartó</label><input id="contactName" name="contactName" /></div>
      <div><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" /></div>
      <div><label htmlFor="phone">Telefonszám</label><input id="phone" name="phone" /></div>
      <div className="full"><label htmlFor="note">Megjegyzés</label><textarea id="note" name="note" /></div>
      {state.message ? <div className={`alert ${state.ok ? 'alert-success' : 'alert-error'} full`}>{state.message}</div> : null}
      <div className="actions full"><SubmitButton>Partner létrehozása</SubmitButton></div>
    </form>
  );
}
