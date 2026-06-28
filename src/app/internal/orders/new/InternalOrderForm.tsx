"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type DeliveryDay = {
  weekday: number;
  cutoff_business_days?: number | null;
};

type PartnerOption = {
  id: number;
  name: string;
  delivery_days?: DeliveryDay[];
};

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

function isBeforeCutoff(value: string, cutoffDays: number | null | undefined) {
  const latestOrderDate = new Date(`${value}T12:00:00`);
  latestOrderDate.setDate(latestOrderDate.getDate() - Number(cutoffDays ?? 0));
  latestOrderDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today <= latestOrderDate;
}

function deliveryDateOptions(deliveryDays: DeliveryDay[] = []) {
  const policiesByWeekday = new Map(deliveryDays.map((day) => [Number(day.weekday), day]));
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

  return options;
}

export function InternalOrderForm({ partners, products }: { partners: PartnerOption[]; products: any[] }) {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [items, setItems] = useState<Record<number, number>>({});
  const [error, setError] = useState("");
  const selectedPartner = partners.find((partner) => String(partner.id) === partnerId);
  const deliveryOptions = useMemo(() => deliveryDateOptions(selectedPartner?.delivery_days ?? []), [selectedPartner]);
  const totalCartons = useMemo(() => (Object.values(items) as number[]).reduce((a, b) => a + Number(b || 0), 0), [items]);

  async function submit() {
    setError("");
    const body = {
      partnerId: Number(partnerId),
      requestedDeliveryDate: deliveryDate,
      paymentMethod,
      submit: true,
      items: (Object.entries(items) as Array<[string, number]>).filter(([, cartons]) => cartons > 0).map(([productId, cartons]) => ({ productId: Number(productId), cartons }))
    };
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await response.json();
    if (!response.ok) return setError(data.error ?? "A rendelés mentése sikertelen.");
    router.push(`/internal/orders/${data.id}`);
    router.refresh();
  }

  return (
    <div className="stack">
      <div className="card form-grid">
        <label>Partner<select value={partnerId} onChange={(e) => { setPartnerId(e.target.value); setDeliveryDate(""); }}><option value="">Válassz partnert</option>{partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label>Kért szállítási nap<select value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} disabled={!partnerId || !deliveryOptions.length}><option value="">{partnerId ? "Válassz szállítási napot" : "Előbb válassz partnert"}</option>{deliveryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <label>Fizetési mód<select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}><option value="bank_transfer">Átutalás</option><option value="cash_on_delivery">Készpénz átadáskor</option><option value="card_on_delivery">Kártya átadáskor</option></select></label>
        <div><div className="metric-label">Összes karton</div><div className="metric-value">{totalCartons}</div></div>
      </div>
      {partnerId && !deliveryOptions.length ? <div className="alert alert-warning">Ehhez a partnerhez nincs aktív, még rendelhető szállítási nap beállítva.</div> : null}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Termék</th><th>Kiszerelés</th><th>Karton tartalma</th><th>Szabad készlet</th><th>Foglalt</th><th>Rendelés után</th><th>Karton</th></tr></thead>
          <tbody>{products.map(p => {
            const orderedCartons = Number(items[p.id] ?? 0);
            const orderedUnits = orderedCartons * Number(p.units_per_carton ?? 0);
            const remainingUnits = Number(p.available_units ?? 0) - orderedUnits;
            return (
              <tr key={p.id}>
                <td>{p.name}<div className="mono text-muted">{p.code}</div></td>
                <td>{p.size_ml} ml</td>
                <td>{p.units_per_carton} db</td>
                <td><strong>{p.available_units} db</strong><div className="text-muted">{cartonCount(p.available_units, p.units_per_carton)} karton</div></td>
                <td>{p.reserved_units} db</td>
                <td className={remainingUnits < 0 ? "text-danger" : ""}>{remainingUnits} db<div className="text-muted">{cartonCount(Math.max(0, remainingUnits), p.units_per_carton)} karton</div></td>
                <td><input type="number" min="0" value={items[p.id] ?? 0} onChange={(e) => setItems({...items, [p.id]: Number(e.target.value)})} /></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
      {error ? <div className="alert alert-danger">{error}</div> : null}
      <div><button className="button button-primary" disabled={!partnerId || !deliveryDate || totalCartons < 1} onClick={submit}>Rendelés beküldése</button></div>
    </div>
  );
}
