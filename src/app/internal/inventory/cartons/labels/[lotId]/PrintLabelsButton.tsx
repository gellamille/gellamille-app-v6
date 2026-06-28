"use client";

import { useState } from "react";

export function PrintLabelsButton({
  lotId,
  cartonIds,
  unprintedCartonIds
}: {
  lotId: number;
  cartonIds: number[];
  unprintedCartonIds: number[];
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const printedCartonCount = cartonIds.length - unprintedCartonIds.length;

  async function printLabels(ids: number[], mode: "all" | "unprinted") {
    if (!ids.length) return;
    if (mode === "all" && !window.confirm("Biztosan újranyomtatod az összes címkét ehhez a LOT-hoz?")) return;
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/inventory/cartons/labels/print", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lotId, cartonIds: ids })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "A nyomtatás naplózása sikertelen.");
      return;
    }
    setMessage(`${data.printed ?? ids.length} címke nyomtatása indítva.`);
    if (mode === "unprinted") document.body.classList.add("print-unprinted-only");
    const cleanup = () => {
      document.body.classList.remove("print-unprinted-only");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
    window.setTimeout(cleanup, 1500);
  }

  return (
    <div className="print-actions">
      <button className="button button-primary" onClick={() => printLabels(unprintedCartonIds, "unprinted")} disabled={loading || !unprintedCartonIds.length}>
        {loading ? "Indítás..." : unprintedCartonIds.length ? `Új címkék nyomtatása (${unprintedCartonIds.length})` : "Nincs új címke"}
      </button>
      {printedCartonCount > 0 ? (
        <button className="button" onClick={() => printLabels(cartonIds, "all")} disabled={loading || !cartonIds.length}>
          Összes címke újranyomtatása
        </button>
      ) : null}
      {message ? <span className={message.includes("sikertelen") ? "text-danger" : "text-success"}>{message}</span> : null}
    </div>
  );
}
