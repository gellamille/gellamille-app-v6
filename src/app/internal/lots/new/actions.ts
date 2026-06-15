'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api/server';
import type { ActionState } from '@/lib/action-state';
import type { LotDto, OperatorDto } from '@/contracts';

export async function createLotAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const lot = await apiFetch<LotDto>('/lots', {
      method: 'POST',
      headers: { 'idempotency-key': String(formData.get('idempotencyKey') ?? '') },
      body: JSON.stringify({
        productionDate: String(formData.get('productionDate') ?? ''),
        productionPeriod: String(formData.get('productionPeriod') ?? ''),
        flavorCode: String(formData.get('flavorCode') ?? ''),
        sizeMl: Number(formData.get('sizeMl')),
        quantity: Number(formData.get('quantity')),
        operatorId: String(formData.get('operatorId') ?? ''),
        note: String(formData.get('note') ?? ''),
      }),
    });
    revalidatePath('/internal/lots/new');
    revalidatePath('/internal/lots');
    revalidatePath('/internal/inventory');
    revalidatePath('/internal/analytics');
    return {
      ok: true,
      message: `A LOT létrejött: ${lot.lotNumber}`,
      data: { lotNumber: lot.lotNumber },
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof ApiError ? error.message : 'A LOT létrehozása sikertelen.',
    };
  }
}

export async function createOperatorAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const operator = await apiFetch<OperatorDto>('/operators', {
      method: 'POST',
      headers: { 'idempotency-key': String(formData.get('idempotencyKey') ?? '') },
      body: JSON.stringify({ name: String(formData.get('name') ?? '') }),
    });
    revalidatePath('/internal/lots/new');
    return {
      ok: true,
      message: `${operator.name} hozzáadva.`,
      data: { operatorId: operator.id },
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof ApiError ? error.message : 'A felelős hozzáadása sikertelen.',
    };
  }
}
