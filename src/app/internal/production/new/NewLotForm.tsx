"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export function NewLotForm({ products, operators }: { products: any[]; operators: any[] }) {
  const router = useRouter();
  const [productId, setProductId] = useState("");
  const [productionDate, setProductionDate] = useState(new Date().toISOString().slice(0, 10));
  const [period, setPeriod] = useState("AM");
  const [quantity, setQuantity] = useState("");
  const [operatorId, setOperatorId] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const selected = useMemo(() => products.find(p => String(p.id) === productId), [products, productId]);
  const cartonPreview = useMemo(() => {
    const units = Number(selected?.units_per_carton ?? 0);
    const total = Number(quantity || 0);
    if (!units || !total) return "";
    const full = Math.floor(total / units);
    const loose = total % units;
    return loose > 0
      ? `Kartonozáskor: ${full} teljes karton + ${loose} db bontott karton`
      : `Kartonozáskor: ${full} karton`;
  }, [quantity, selected]);

  function choose(value: string) {
    setProductId(value);
  }

  async function submit() {
    if (!confirm("Biztos, hogy létrehozol egy új LOT számot?")) return;
    setError("");
    const response = await fetch("/api/lots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: Number(productId),
        productionDate,
        productionPeriod: period,
        quantity: Number(quantity),
        operatorId: Number(operatorId),
        note
      })
    });
    const data = await response.json();
    if (!response.ok) return setError(data.error ?? "A LOT létrehozása sikertelen.");
    router.push("/internal/production");
    router.refresh();
  }

  return (
    <section className="card">
      <div className="form-grid">
        <label className="full">Termék
          <select value={productId} onChange={(e) => choose(e.target.value)}>
            <option value="">Válassz terméket</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name} – {p.size_ml} ml ({p.code})</option>)}
          </select>
        </label>
        <label>Gyártás dátuma<input type="date" value={productionDate} onChange={(e) => setProductionDate(e.target.value)} /></label>
        <label>Gyártási időszak<select value={period} onChange={(e) => setPeriod(e.target.value)}><option value="AM">Délelőtt (AM)</option><option value="PM">Délután (PM)</option></select></label>
        <label>Gyártott darabszám<input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></label>
        <label>Felelős<select value={operatorId} onChange={(e) => setOperatorId(e.target.value)}><option value="">Válassz felelőst</option>{operators.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select></label>
        <label>Várható LOT-formátum<input disabled value={selected ? `${selected.code.slice(0,3)}${selected.size_ml === 150 ? "15" : "30"}-${productionDate.slice(2,4)}-####` : ""} /></label>
        <label>Várható kartonozás<input disabled value={cartonPreview} /></label>
        <label className="full">Megjegyzés<textarea value={note} onChange={(e) => setNote(e.target.value)} /></label>
      </div>
      {error ? <div className="alert alert-danger section-gap">{error}</div> : null}
      <div className="section-gap"><button className="button button-primary" disabled={!productId || !quantity || !operatorId} onClick={submit}>LOT létrehozása és készletre vétele</button></div>
    </section>
  );
}
