"use client";

import { useState } from "react";

export function PrintLabelsButton({ lotId, cartonIds }: { lotId: number; cartonIds: number[] }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function printLabels() {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/inventory/cartons/labels/print", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lotId, cartonIds })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "A nyomtatás naplózása sikertelen.");
      return;
    }
    setMessage(`${data.printed ?? cartonIds.length} címke naplózva.`);
    window.print();
  }

  return (
    <div className="print-actions">
      <button className="button button-primary" onClick={printLabels} disabled={loading || !cartonIds.length}>
        {loading ? "Naplózás..." : "Címkék nyomtatása"}
      </button>
      {message ? <span className={message.includes("sikertelen") ? "text-danger" : "text-success"}>{message}</span> : null}
    </div>
  );
}
