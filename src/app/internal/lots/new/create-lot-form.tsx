'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import type { FlavorDto, OperatorDto } from '@/contracts';
import { initialActionState } from '@/lib/action-state';
import { SubmitButton } from '@/components/submit-button';
import { createLotAction, createOperatorAction } from './actions';

function addMonthsClamped(dateString: string, months: number): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const target = new Date(Date.UTC(year!, month! - 1 + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  return new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), Math.min(day!, lastDay)))
    .toISOString()
    .slice(0, 10);
}

export function CreateLotForm({ flavors, operators, createKey, operatorKey }: { flavors: FlavorDto[]; operators: OperatorDto[]; createKey: string; operatorKey: string }) {
  const [state, action] = useActionState(createLotAction, initialActionState);
  const [operatorState, operatorAction] = useActionState(createOperatorAction, initialActionState);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [operatorOpen, setOperatorOpen] = useState(false);
  const [selectedOperatorId, setSelectedOperatorId] = useState('');
  const [productionDate, setProductionDate] = useState(new Date().toISOString().slice(0, 10));
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!operatorState.ok) return;
    const operatorId = operatorState.data?.operatorId;
    if (typeof operatorId === 'string') setSelectedOperatorId(operatorId);
    setOperatorOpen(false);
  }, [operatorState]);

  const summary = () => {
    const form = formRef.current;
    if (!form) return '';
    const data = new FormData(form);
    const flavor = flavors.find((item) => item.code === data.get('flavorCode'));
    const operator = operators.find((item) => item.id === data.get('operatorId'));
    return `${flavor?.name ?? ''}, ${data.get('sizeMl')} ml, ${data.get('quantity')} db, ${data.get('productionDate')} ${data.get('productionPeriod')}, felelős: ${operator?.name ?? ''}`;
  };

  return (
    <>
      <form ref={formRef} action={action} className="form-grid">
        <input type="hidden" name="idempotencyKey" value={createKey} />
        <div>
          <label className="required" htmlFor="productionDate">Gyártás dátuma</label>
          <input id="productionDate" name="productionDate" type="date" value={productionDate} onChange={(event) => setProductionDate(event.target.value)} required />
        </div>
        <div>
          <label className="required" htmlFor="productionPeriod">Gyártási időszak</label>
          <select id="productionPeriod" name="productionPeriod" defaultValue="AM" required>
            <option value="AM">Délelőtt</option>
            <option value="PM">Délután</option>
          </select>
        </div>
        <div className="full">
          <label className="required" htmlFor="flavorCode">Íz</label>
          <select id="flavorCode" name="flavorCode" required>
            {flavors.map((flavor) => <option key={flavor.code} value={flavor.code}>{flavor.name} ({flavor.code})</option>)}
          </select>
        </div>
        <div>
          <label className="required" htmlFor="sizeMl">Kiszerelés</label>
          <select id="sizeMl" name="sizeMl" defaultValue="150" required>
            <option value="150">150 ml</option>
            <option value="300">300 ml</option>
          </select>
        </div>
        <div>
          <label>Automatikus lejárat</label>
          <input value={addMonthsClamped(productionDate, 3)} readOnly />
        </div>
        <div>
          <label className="required" htmlFor="quantity">Gyártott darabszám</label>
          <input id="quantity" name="quantity" type="number" min="1" step="1" required />
        </div>
        <div>
          <label className="required" htmlFor="operatorId">Gyártásért felelős</label>
          <select
            id="operatorId"
            name="operatorId"
            required
            value={selectedOperatorId}
            onChange={(event) => setSelectedOperatorId(event.target.value)}
          >
            <option value="" disabled>Válassz felelőst</option>
            {operators.map((operator) => <option key={operator.id} value={operator.id}>{operator.name}</option>)}
          </select>
        </div>
        <div className="full">
          <button type="button" className="button button-secondary" onClick={() => setOperatorOpen(true)}>Új felelős személy hozzáadása</button>
        </div>
        <div className="full">
          <label htmlFor="note">Megjegyzés</label>
          <textarea id="note" name="note" />
        </div>
        {state.message ? <div className={`alert ${state.ok ? 'alert-success' : 'alert-error'} full`}>{state.message}</div> : null}
        <div className="actions full">
          <button type="button" className="button button-primary" onClick={() => {
            if (formRef.current?.reportValidity()) setConfirmOpen(true);
          }}>LOT létrehozása</button>
        </div>
      </form>

      {confirmOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h2>Biztos, hogy létrehozol egy új LOT számot?</h2>
            <div className="alert alert-warning">{summary()}</div>
            <div className="actions">
              <button className="button button-secondary" type="button" onClick={() => setConfirmOpen(false)}>Mégse</button>
              <button className="button button-primary" type="button" onClick={() => {
                setConfirmOpen(false);
                formRef.current?.requestSubmit();
              }}>Igen, létrehozom</button>
            </div>
          </div>
        </div>
      ) : null}

      {operatorOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h2>Új felelős személy hozzáadása</h2>
            <form action={operatorAction}>
              <input type="hidden" name="idempotencyKey" value={operatorKey} />
              <label className="required" htmlFor="operatorName">Felelős neve</label>
              <input id="operatorName" name="name" minLength={2} maxLength={80} required autoFocus />
              {operatorState.message ? <div className={`alert ${operatorState.ok ? 'alert-success' : 'alert-error'}`}>{operatorState.message}</div> : null}
              <div className="actions">
                <button className="button button-secondary" type="button" onClick={() => setOperatorOpen(false)}>Mégse</button>
                <SubmitButton>Hozzáadás</SubmitButton>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
