"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function GenerateCartonsButton({ lotId, remainingUnits }: { lotId: number; remainingUnits: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function generate() {
    if (!remainingUnits) return;
    if (!window.confirm(`Létrehozzuk a még kartonozatlan ${remainingUnits} db termék kartoncímkéit?`)) return;
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/inventory/cartons/labels/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lotId })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "A kartoncímkék generálása sikertelen.");
      return;
    }
    setMessage(`${data.carton_count ?? 0} karton létrejött.`);
    router.refresh();
  }

  return (
    <>
      <button className="button button-primary" onClick={generate} disabled={loading || remainingUnits <= 0}>
        {loading ? "Generálás..." : `Kartonozás/címkék generálása (${remainingUnits} db)`}
      </button>
      {message ? <span className={message.includes("sikertelen") ? "text-danger" : "text-success"}>{message}</span> : null}
    </>
  );
}
