"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function GenerateCartonsButton({
  lotId,
  remainingUnits,
  unitsPerCarton
}: {
  lotId: number;
  remainingUnits: number;
  unitsPerCarton: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [quantityUnits, setQuantityUnits] = useState("");

  async function generate() {
    if (!remainingUnits) return;
    const quantity = Number(quantityUnits);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      setMessage("Add meg, hány darabot kartonozol most.");
      return;
    }
    if (quantity > remainingUnits) {
      setMessage(`Legfeljebb ${remainingUnits} db kartonozható ebből a LOT-ból.`);
      return;
    }
    const fullCartons = Math.floor(quantity / Math.max(1, unitsPerCarton));
    const remainder = quantity % Math.max(1, unitsPerCarton);
    const cartonText = `${fullCartons}${remainder ? ` teljes + 1 bontott (${remainder} db)` : ""} karton`;
    if (!window.confirm(`${quantity} db termékből létrehozzuk a kartonokat és címkéket? Várhatóan ${cartonText}.`)) return;
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/inventory/cartons/labels/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lotId, quantityUnits: quantity })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "A kartoncímkék generálása sikertelen.");
      return;
    }
    setQuantityUnits("");
    setMessage(`${data.carton_count ?? 0} karton létrejött ${data.carton_units ?? quantity} db termékből.`);
    router.refresh();
  }

  return (
    <div className="inline">
      <label>
        Kartonozott db
        <input
          type="number"
          min="1"
          max={remainingUnits}
          value={quantityUnits}
          onChange={(event) => setQuantityUnits(event.target.value)}
          placeholder={String(remainingUnits)}
          disabled={loading || remainingUnits <= 0}
          style={{ width: 130 }}
        />
      </label>
      <button className="button button-primary" onClick={generate} disabled={loading || remainingUnits <= 0}>
        {loading ? "Generálás..." : "Kartonozás/címkék generálása"}
      </button>
      {message ? <span className={message.includes("létrejött") ? "text-success" : "text-danger"}>{message}</span> : null}
    </div>
  );
}
