"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export function InternalOrderForm({ partners, products }: { partners: any[]; products: any[] }) {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [items, setItems] = useState<Record<number, number>>({});
  const [error, setError] = useState("");
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
        <label>Partner<select value={partnerId} onChange={(e) => setPartnerId(e.target.value)}><option value="">Válassz partnert</option>{partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label>Kért szállítási nap<input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} /></label>
        <label>Fizetési mód<select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}><option value="bank_transfer">Átutalás</option><option value="cash_on_delivery">Készpénz átadáskor</option><option value="card_on_delivery">Kártya átadáskor</option></select></label>
        <div><div className="metric-label">Összes karton</div><div className="metric-value">{totalCartons}</div></div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Termék</th><th>Kiszerelés</th><th>Karton tartalma</th><th>Karton</th></tr></thead>
          <tbody>{products.map(p => <tr key={p.id}><td>{p.name}</td><td>{p.size_ml} ml</td><td>{p.units_per_carton} db</td><td><input type="number" min="0" value={items[p.id] ?? 0} onChange={(e) => setItems({...items, [p.id]: Number(e.target.value)})} /></td></tr>)}</tbody>
        </table>
      </div>
      {error ? <div className="alert alert-danger">{error}</div> : null}
      <div><button className="button button-primary" disabled={!partnerId || !deliveryDate || totalCartons < 1} onClick={submit}>Rendelés beküldése</button></div>
    </div>
  );
}
