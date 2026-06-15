'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ShipmentDto } from '@/contracts';
import type { ActionState } from '@/lib/action-state';
import { ApiError, apiFetch } from '@/lib/api/server';

function messageFrom(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

function refreshShipmentPaths(id?: string): void {
  revalidatePath('/internal/shipments');
  revalidatePath('/internal/inventory');
  revalidatePath('/internal/partners');
  if (id) revalidatePath(`/internal/shipments/${id}`);
}

export async function createShipmentAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let shipment: ShipmentDto;
  try {
    shipment = await apiFetch<ShipmentDto>('/shipments', {
      method: 'POST',
      headers: { 'idempotency-key': String(formData.get('idempotencyKey') ?? '') },
      body: JSON.stringify({
        partnerId: String(formData.get('partnerId') ?? ''),
        shipmentDate: String(formData.get('shipmentDate') ?? ''),
        shippingAddress: String(formData.get('shippingAddress') ?? ''),
        customerOrderNumber: String(formData.get('customerOrderNumber') ?? ''),
        deliveryNoteNumber: String(formData.get('deliveryNoteNumber') ?? ''),
        note: String(formData.get('note') ?? ''),
      }),
    });
  } catch (error) {
    return {
      ok: false,
      message: messageFrom(error, 'A szállítmány létrehozása sikertelen.'),
    };
  }

  refreshShipmentPaths(shipment.id);
  redirect(`/internal/shipments/${shipment.id}`);
}

export async function setShipmentItemAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const shipmentId = String(formData.get('shipmentId') ?? '');
  const lotId = String(formData.get('lotId') ?? '');
  try {
    await apiFetch(`/shipments/${shipmentId}/items/${lotId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity: Number(formData.get('quantity')) }),
    });
    refreshShipmentPaths(shipmentId);
    return { ok: true, message: 'A LOT hozzárendelése frissült.' };
  } catch (error) {
    return {
      ok: false,
      message: messageFrom(error, 'A LOT hozzárendelése sikertelen.'),
    };
  }
}

export async function removeShipmentItemAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const shipmentId = String(formData.get('shipmentId') ?? '');
  const itemId = String(formData.get('itemId') ?? '');
  try {
    await apiFetch(`/shipments/${shipmentId}/items/${itemId}`, { method: 'DELETE' });
    refreshShipmentPaths(shipmentId);
    return { ok: true, message: 'A LOT eltávolítva a szállítmányból.' };
  } catch (error) {
    return {
      ok: false,
      message: messageFrom(error, 'A LOT eltávolítása sikertelen.'),
    };
  }
}

export async function transitionShipmentAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const shipmentId = String(formData.get('shipmentId') ?? '');
  const targetStatus = String(formData.get('targetStatus') ?? '');
  try {
    await apiFetch(`/shipments/${shipmentId}/transition`, {
      method: 'POST',
      body: JSON.stringify({ targetStatus }),
    });
    refreshShipmentPaths(shipmentId);
    return {
      ok: true,
      message: targetStatus === 'closed'
        ? 'A szállítmány lezárva.'
        : 'A szállítmány kiszállítottnak jelölve.',
    };
  } catch (error) {
    return {
      ok: false,
      message: messageFrom(error, 'A státuszváltás sikertelen.'),
    };
  }
}

export async function voidShipmentAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const shipmentId = String(formData.get('shipmentId') ?? '');
  const reason = String(formData.get('reason') ?? '').trim();
  try {
    await apiFetch(`/shipments/${shipmentId}/void`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    refreshShipmentPaths(shipmentId);
    return { ok: true, message: 'A szállítmány sztornózva lett.' };
  } catch (error) {
    return {
      ok: false,
      message: messageFrom(error, 'A szállítmány sztornózása sikertelen.'),
    };
  }
}
