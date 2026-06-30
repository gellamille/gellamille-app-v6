"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type FieldName = "productId" | "productionDate" | "quantity" | "operatorId";

export function NewLotForm({ products, operators }: { products: any[]; operators: any[] }) {
  const router = useRouter();
  const [productId, setProductId] = useState("");
  const [productionDate, setProductionDate] = useState(new Date().toISOString().slice(0, 10));
  const [period, setPeriod] = useState("AM");
  const [quantity, setQuantity] = useState("");
  const [operatorId, setOperatorId] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
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
    setFieldErrors((current) => ({ ...current, productId: "" }));
    setError("");
  }

  function validate() {
    const next: Partial<Record<FieldName, string>> = {};
    if (!productId) next.productId = "Válassz terméket a LOT-hoz.";
    if (!productionDate) next.productionDate = "Add meg a gyártás dátumát.";
    if (!quantity || Number(quantity) <= 0) next.quantity = "Add meg a gyártott darabszámot, legalább 1 db.";
    if (!operatorId) next.operatorId = "Válassz felelőst. E nélkül nem lehet LOT-ot létrehozni.";

    setFieldErrors(next);
    const messages = Object.values(next).filter(Boolean);
    if (messages.length) {
      setError(messages[0] ?? "Hiányzó adat van az űrlapon.");
      return false;
    }
    setError("");
    return true;
  }

  async function submit() {
    if (!validate()) return;
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
        <label className={`full ${fieldErrors.productId ? "field-invalid" : ""}`}>Termék
          <select value={productId} onChange={(e) => choose(e.target.value)} aria-invalid={Boolean(fieldErrors.productId)}>
            <option value="">Válassz terméket</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name} – {p.size_ml} ml ({p.code})</option>)}
          </select>
          {fieldErrors.productId ? <span className="field-message">{fieldErrors.productId}</span> : null}
        </label>
        <label className={fieldErrors.productionDate ? "field-invalid" : ""}>Gyártás dátuma<input type="date" value={productionDate} aria-invalid={Boolean(fieldErrors.productionDate)} onChange={(e) => { setProductionDate(e.target.value); setFieldErrors((current) => ({ ...current, productionDate: "" })); setError(""); }} />{fieldErrors.productionDate ? <span className="field-message">{fieldErrors.productionDate}</span> : null}</label>
        <label>Gyártási időszak<select value={period} onChange={(e) => setPeriod(e.target.value)}><option value="AM">Délelőtt (AM)</option><option value="PM">Délután (PM)</option></select></label>
        <label className={fieldErrors.quantity ? "field-invalid" : ""}>Gyártott darabszám<input type="number" min="1" value={quantity} aria-invalid={Boolean(fieldErrors.quantity)} onChange={(e) => { setQuantity(e.target.value); setFieldErrors((current) => ({ ...current, quantity: "" })); setError(""); }} />{fieldErrors.quantity ? <span className="field-message">{fieldErrors.quantity}</span> : null}</label>
        <label className={fieldErrors.operatorId ? "field-invalid" : ""}>Felelős<select value={operatorId} aria-invalid={Boolean(fieldErrors.operatorId)} onChange={(e) => { setOperatorId(e.target.value); setFieldErrors((current) => ({ ...current, operatorId: "" })); setError(""); }}><option value="">Válassz felelőst</option>{operators.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select>{fieldErrors.operatorId ? <span className="field-message">{fieldErrors.operatorId}</span> : null}</label>
        <label>Várható LOT-formátum<input disabled value={selected ? `${selected.code.slice(0,3)}${selected.size_ml === 150 ? "15" : "30"}-${productionDate.slice(2,4)}-####` : ""} /></label>
        <label>Várható kartonozás<input disabled value={cartonPreview} /></label>
        <label className="full">Megjegyzés<textarea value={note} onChange={(e) => setNote(e.target.value)} /></label>
      </div>
      {error ? <div className="alert alert-danger section-gap">{error}</div> : null}
      <div className="section-gap"><button className="button button-primary" onClick={submit}>LOT létrehozása és készletre vétele</button></div>
    </section>
  );
}
