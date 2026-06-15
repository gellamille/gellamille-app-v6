'use server';

import { revalidatePath } from 'next/cache';
import type { ActionState } from '@/lib/action-state';
import { ApiError, apiFetch } from '@/lib/api/server';

export async function createPartnerAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await apiFetch('/partners', {
      method: 'POST',
      headers: { 'idempotency-key': String(formData.get('idempotencyKey') ?? '') },
      body: JSON.stringify({
        name: String(formData.get('name') ?? ''),
        billingName: String(formData.get('billingName') ?? ''),
        taxNumber: String(formData.get('taxNumber') ?? ''),
        shippingAddress: String(formData.get('shippingAddress') ?? ''),
        contactName: String(formData.get('contactName') ?? ''),
        email: String(formData.get('email') ?? ''),
        phone: String(formData.get('phone') ?? ''),
        note: String(formData.get('note') ?? ''),
      }),
    });
    revalidatePath('/internal/partners');
    revalidatePath('/internal/shipments');
    return { ok: true, message: 'A partner létrejött.' };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof ApiError ? error.message : 'A partner létrehozása sikertelen.',
    };
  }
}


export async function updatePartnerDeliveryDaysAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const partnerId = String(formData.get('partnerId') ?? '');
  const days = Array.from({ length: 7 }, (_, index) => index + 1)
    .filter((weekday) => formData.get(`weekday-${weekday}`) === 'on')
    .map((weekday) => ({
      weekday,
      cutoffBusinessDays: Number(
        formData.get(`cutoff-${weekday}`) ?? 2,
      ),
    }));

  try {
    await apiFetch(`/partners/${partnerId}/delivery-days`, {
      method: 'PUT',
      body: JSON.stringify({ days }),
    });
    revalidatePath(`/internal/partners/${partnerId}`);
    return { ok: true, message: 'A szállítási napok frissültek.' };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof ApiError
          ? error.message
          : 'A szállítási napok mentése sikertelen.',
    };
  }
}
