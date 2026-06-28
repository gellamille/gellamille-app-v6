"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const weekdayLabels: Record<number, string> = {
  1: "Hétfő",
  2: "Kedd",
  3: "Szerda",
  4: "Csütörtök",
  5: "Péntek",
  6: "Szombat",
  7: "Vasárnap"
};

function cartonCount(units: number, unitsPerCarton: number) {
  if (!unitsPerCarton) return 0;
  return Math.floor(Number(units || 0) / Number(unitsPerCarton));
}

function isoWeekday(date: Date) {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

function localIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeDate(value: unknown) {
  return typeof value === "string" && value ? value.slice(0, 10) : "";
}

function isBeforeCutoff(value: string, cutoffDays: number | null | undefined) {
  const latestOrderDate = new Date(`${value}T12:00:00`);
  latestOrderDate.setDate(latestOrderDate.getDate() - Number(cutoffDays ?? 0));
  latestOrderDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today <= latestOrderDate;
}

function deliveryDateOptions(deliveryDays: any[], currentValue: string) {
  const safeDays = Array.isArray(deliveryDays) ? deliveryDays : [];
  const policiesByWeekday = new Map(safeDays.map((day) => [Number(day.weekday), day]));
  const options: Array<{ value: string; label: string }> = [];
  const date = new Date();
  date.setHours(12, 0, 0, 0);

  for (let index = 0; index < 84; index += 1) {
    const weekday = isoWeekday(date);
    const policy = policiesByWeekday.get(weekday);
    const value = localIsoDate(date);
    if (policy && isBeforeCutoff(value, policy.cutoff_business_days)) {
      options.push({ value, label: `${value} · ${weekdayLabels[weekday]}` });
    }
    date.setDate(date.getDate() + 1);
  }

  if (currentValue && !options.some((option) => option.value === currentValue)) {
    const currentDate = new Date(`${currentValue}T12:00:00`);
    const weekday = isoWeekday(currentDate);
    if (Number.isFinite(currentDate.getTime()) && policiesByWeekday.has(weekday)) options.unshift({ value: currentValue, label: `${currentValue} · ${weekdayLabels[weekday]} (jelenlegi)` });
  }

  return options;
}

export function EditOrderForm({ order, items, products, addresses, deliveryDays }: any) {
  const router = useRouter();
  const [deliveryDate, setDeliveryDate] = useState(normalizeDate(order.requested_delivery_date));
  const [paymentMethod, setPaymentMethod] = useState(order.payment_method ?? "bank_transfer");
  const [addressId, setAddressId] = useState(order.delivery_address_id ? String(order.delivery_address_id) : "");
  const [note, setNote] = useState(order.note ?? "");
  const [cartons, setCartons] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const item of Array.isArray(items) ? items : []) initial[String(item.product_id)] = Number(item.cartons ?? 0);
    return initial;
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const deliveryOptions = useMemo(() => deliveryDateOptions(deliveryDays, normalizeDate(order.requested_delivery_date)), [deliveryDays, order.requested_delivery_date]);
  const totalCartons = useMemo(() => Object.values(cartons).reduce((sum, value) => sum + Number(value || 0), 0), [cartons]);
  const editable = !["closed", "cancelled", "void"].includes(order.status) && !["delivered", "cancelled"].includes(order.fulfillment_status) && !["receivable", "paid", "partially_paid", "overdue", "void"].includes(order.finance_status);

  async function save() {
    setBusy(true);
    setError("");
    const response = await fetch(`/api/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestedDeliveryDate: deliveryDate,
        paymentMethod,
        deliveryAddressId: addressId ? Number(addressId) : null,
        note,
        items: Object.entries(cartons)
          .filter(([, value]) => Number(value) > 0)
          .map(([productId, value]) => ({ productId: Number(productId), cartons: Number(value) }))
      })
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(data.error ?? "A rendelés módosítása sikertelen.");
      return;
    }
    router.push(`/internal/orders/${order.id}`);
    router.refresh();
  }

  return (
    <div className="stack">
      {!editable ? <div className="alert alert-warning">Ez a rendelés már nem szerkeszthető, mert lezárt, átadott vagy pénzügyileg érintett állapotban van.</div> : null}
      <div className="card form-grid">
        <label>Partner<input value={order.partner_name} disabled /></label>
        <label>Kért szállítási nap<select value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} disabled={!editable || !deliveryOptions.length}><option value="">Válassz szállítási napot</option>{deliveryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <label>Szállítási cím<select value={addressId} onChange={(event) => setAddressId(event.target.value)} disabled={!editable || !addresses.length}><option value="">Nincs külön cím</option>{addresses.map((address: any) => <option key={address.id} value={address.id}>{address.name} - {address.postal_code} {address.city}, {address.address_line1}</option>)}</select></label>
        <label>Fizetési mód<select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} disabled={!editable}><option value="bank_transfer">Átutalás</option><option value="cash_on_delivery">Készpénz átadáskor</option><option value="card_on_delivery">Kártya átadáskor</option></select></label>
        <label className="full">Megjegyzés<textarea value={note} onChange={(event) => setNote(event.target.value)} disabled={!editable} /></label>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Termék</th><th>Kiszerelés</th><th>Karton tartalma</th><th>Szabad készlet</th><th>Foglalt</th><th>Rendelés után</th><th>Karton</th></tr></thead>
          <tbody>{(Array.isArray(products) ? products : []).map((product: any) => {
            const productId = String(product.id);
            const orderedCartons = Number(cartons[productId] ?? 0);
            const orderedUnits = orderedCartons * Number(product.units_per_carton ?? 0);
            const remainingUnits = Number(product.available_units ?? 0) - orderedUnits;
            return (
              <tr key={productId}>
                <td>{product.name}<div className="mono text-muted">{product.code}</div></td>
                <td>{product.size_ml} ml</td>
                <td>{product.units_per_carton} db</td>
                <td><strong>{product.available_units} db</strong><div className="text-muted">{cartonCount(product.available_units, product.units_per_carton)} karton</div></td>
                <td>{product.reserved_units} db</td>
                <td className={remainingUnits < 0 ? "text-danger" : ""}>{remainingUnits} db<div className="text-muted">{cartonCount(Math.max(0, remainingUnits), product.units_per_carton)} karton</div></td>
                <td><input type="number" min="0" value={cartons[productId] ?? 0} disabled={!editable} onChange={(event) => setCartons({ ...cartons, [productId]: Number(event.target.value) })} /></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
      <div className="card">
        <div className="metric-label">Összes karton</div>
        <div className="metric-value">{totalCartons}</div>
      </div>
      {error ? <div className="alert alert-danger">{error}</div> : null}
      <div className="inline">
        <button className="button button-primary" disabled={!editable || busy || !deliveryDate || totalCartons < 1} onClick={save}>Módosítások mentése</button>
        <button className="button" type="button" onClick={() => router.push(`/internal/orders/${order.id}`)}>Mégsem</button>
      </div>
    </div>
  );
}
