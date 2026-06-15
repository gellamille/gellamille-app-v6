'use client';

import { useActionState } from 'react';
import type { PartnerDeliveryDayDto } from '@/contracts';
import { SubmitButton } from '@/components/submit-button';
import { initialActionState } from '@/lib/action-state';
import { updatePartnerDeliveryDaysAction } from '../actions';

const weekdays = [
  [1, 'Hétfő'],
  [2, 'Kedd'],
  [3, 'Szerda'],
  [4, 'Csütörtök'],
  [5, 'Péntek'],
  [6, 'Szombat'],
  [7, 'Vasárnap'],
] as const;

export function DeliveryDaysForm({
  partnerId,
  deliveryDays,
}: {
  partnerId: string;
  deliveryDays: PartnerDeliveryDayDto[];
}) {
  const [state, action] = useActionState(
    updatePartnerDeliveryDaysAction,
    initialActionState,
  );
  const byWeekday = new Map(
    deliveryDays.map((day) => [day.weekday, day]),
  );

  return (
    <form action={action}>
      <input type="hidden" name="partnerId" value={partnerId} />
      <div className="delivery-days-grid">
        {weekdays.map(([weekday, label]) => {
          const current = byWeekday.get(weekday);
          return (
            <div className="delivery-day-row" key={weekday}>
              <label className="checkbox-field">
                <input
                  name={`weekday-${weekday}`}
                  type="checkbox"
                  defaultChecked={Boolean(current)}
                />
                {label}
              </label>
              <div>
                <label htmlFor={`cutoff-${weekday}`}>
                  Határidő munkanapban
                </label>
                <input
                  id={`cutoff-${weekday}`}
                  name={`cutoff-${weekday}`}
                  type="number"
                  min={0}
                  max={30}
                  defaultValue={current?.cutoffBusinessDays ?? 2}
                />
              </div>
            </div>
          );
        })}
      </div>

      {state.message ? (
        <div className={`alert ${state.ok ? 'alert-success' : 'alert-error'}`}>
          {state.message}
        </div>
      ) : null}

      <div className="actions">
        <SubmitButton>Szállítási napok mentése</SubmitButton>
      </div>
    </form>
  );
}
