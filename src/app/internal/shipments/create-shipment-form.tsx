'use client';

import { useActionState, useMemo, useState } from 'react';
import type { PartnerDto } from '@/contracts';
import { SubmitButton } from '@/components/submit-button';
import { initialActionState } from '@/lib/action-state';
import { createShipmentAction } from './actions';

function today(): string {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function CreateShipmentForm({ partners, idempotencyKey }: { partners: PartnerDto[]; idempotencyKey: string }) {
  const [state, action] = useActionState(createShipmentAction, initialActionState);
  const [partnerId, setPartnerId] = useState('');
  const selectedPartner = useMemo(
    () => partners.find((partner) => partner.id === partnerId),
    [partnerId, partners],
  );

  return (
    <form action={action} className="form-grid">
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
      <div className="full">
        <label className="required" htmlFor="partnerId">Partner</label>
        <select
          id="partnerId"
          name="partnerId"
          value={partnerId}
          onChange={(event) => setPartnerId(event.target.value)}
          required
        >
          <option value="" disabled>Válassz partnert</option>
          {partners.filter((partner) => partner.active).map((partner) => (
            <option key={partner.id} value={partner.id}>{partner.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="required" htmlFor="shipmentDate">Szállítás dátuma</label>
        <input id="shipmentDate" name="shipmentDate" type="date" defaultValue={today()} required />
      </div>
      <div>
        <label htmlFor="customerOrderNumber">Partner rendelési száma</label>
        <input id="customerOrderNumber" name="customerOrderNumber" maxLength={100} />
      </div>
      <div>
        <label htmlFor="deliveryNoteNumber">Szállítólevél száma</label>
        <input id="deliveryNoteNumber" name="deliveryNoteNumber" maxLength={100} />
      </div>
      <div className="full">
        <label htmlFor="shippingAddress">Szállítási cím</label>
        <textarea
          id="shippingAddress"
          name="shippingAddress"
          key={selectedPartner?.id ?? 'empty'}
          defaultValue={selectedPartner?.shippingAddress ?? ''}
          maxLength={500}
        />
      </div>
      <div className="full">
        <label htmlFor="note">Megjegyzés</label>
        <textarea id="note" name="note" maxLength={1000} />
      </div>
      {state.message ? (
        <div className={`alert ${state.ok ? 'alert-success' : 'alert-error'} full`}>
          {state.message}
        </div>
      ) : null}
      <div className="actions full">
        <SubmitButton>Piszkozat létrehozása</SubmitButton>
      </div>
    </form>
  );
}
