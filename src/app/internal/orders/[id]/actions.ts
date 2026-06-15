'use server';

import { revalidatePath } from 'next/cache';
import type { ActionState } from '@/lib/action-state';
import { ApiError, apiFetch } from '@/lib/api/server';

export async function transitionOrderAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get('id') ?? '');
  const targetStatus = String(formData.get('targetStatus') ?? '');

  try {
    await apiFetch(`/orders/${id}/transition`, {
      method: 'POST',
      body: JSON.stringify({ targetStatus }),
    });
    revalidatePath('/internal/orders');
    revalidatePath(`/internal/orders/${id}`);
    return { ok: true, message: 'A rendelés státusza frissült.' };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof ApiError
          ? error.message
          : 'A státuszváltás sikertelen.',
    };
  }
}

export async function rejectOrderAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get('id') ?? '');

  try {
    await apiFetch(`/orders/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({
        reason: String(formData.get('reason') ?? ''),
      }),
    });
    revalidatePath('/internal/orders');
    revalidatePath(`/internal/orders/${id}`);
    return { ok: true, message: 'A rendelés elutasítva.' };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof ApiError
          ? error.message
          : 'A rendelés elutasítása sikertelen.',
    };
  }
}

export async function voidOrderAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get('id') ?? '');

  try {
    await apiFetch(`/orders/${id}/void`, {
      method: 'POST',
      body: JSON.stringify({
        reason: String(formData.get('reason') ?? ''),
      }),
    });
    revalidatePath('/internal/orders');
    revalidatePath(`/internal/orders/${id}`);
    return { ok: true, message: 'A rendelés sztornózva.' };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof ApiError
          ? error.message
          : 'A rendelés sztornózása sikertelen.',
    };
  }
}
