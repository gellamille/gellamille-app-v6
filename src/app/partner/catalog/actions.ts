'use server';

import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';
import type { OrderDto } from '@/contracts';
import type { ActionState } from '@/lib/action-state';
import { ApiError, apiFetch } from '@/lib/api/server';

export async function createOrderAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let items: Array<{ productId: string; cartons: number }>;

  try {
    items = JSON.parse(
      String(formData.get('items') ?? '[]'),
    ) as Array<{ productId: string; cartons: number }>;
  } catch {
    return {
      ok: false,
      message: 'A kosár tartalma hibás. Frissítsd az oldalt.',
    };
  }

  let order: OrderDto;

  try {
    order = await apiFetch<OrderDto>(
      '/partner-portal/orders',
      {
        method: 'POST',
        headers: {
          'idempotency-key': randomUUID(),
        },
        body: JSON.stringify({
          requestedDeliveryDate: String(
            formData.get('requestedDeliveryDate') ?? '',
          ),
          paymentMethod: String(
            formData.get('paymentMethod') ?? '',
          ),
          note: String(formData.get('note') ?? ''),
          items,
        }),
      },
    );
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof ApiError
          ? error.message
          : 'A rendelés beküldése sikertelen.',
    };
  }

  redirect(`/partner/orders/${order.id}?created=1`);
}
