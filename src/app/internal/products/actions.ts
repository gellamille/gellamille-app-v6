'use server';

import { revalidatePath } from 'next/cache';
import type { ActionState } from '@/lib/action-state';
import { ApiError, apiFetch } from '@/lib/api/server';

export async function updateProductAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get('id') ?? '');

  try {
    await apiFetch(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        netUnitPriceHuf: Number(formData.get('netUnitPriceHuf')),
        active: formData.get('active') === 'on',
        sortOrder: Number(formData.get('sortOrder')),
        version: Number(formData.get('version')),
      }),
    });

    revalidatePath('/internal/products');
    return { ok: true, message: 'A termék frissült.' };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof ApiError
          ? error.message
          : 'A termék módosítása sikertelen.',
    };
  }
}
