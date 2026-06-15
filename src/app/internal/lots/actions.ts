'use server';

import { revalidatePath } from 'next/cache';
import { ApiError, apiFetch } from '@/lib/api/server';
import type { ActionState } from '@/lib/action-state';

export async function voidLotAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get('id') ?? '');
  const reason = String(formData.get('reason') ?? '').trim();
  try {
    await apiFetch(`/lots/${id}/void`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    revalidatePath('/internal/lots');
    revalidatePath('/internal/inventory');
    revalidatePath('/internal/analytics');
    return { ok: true, message: 'A LOT sztornózva lett.' };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof ApiError ? error.message : 'A sztornózás sikertelen.',
    };
  }
}
