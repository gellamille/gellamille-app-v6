"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function UnpickCartonButton({ orderId, allocationId, cartonCode }: { orderId: number; allocationId: number; cartonCode: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function unpick() {
    if (!confirm(`Biztosan visszavonod ezt a kartont a rendelésből? ${cartonCode}`)) return;
    setLoading(true);
    setError("");
    const response = await fetch(`/api/orders/${orderId}/carton-picks`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allocationId })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "A visszavonás sikertelen.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="stack">
      <button className="button button-small" onClick={unpick} disabled={loading}>
        {loading ? "Visszavonás..." : "Visszavonás"}
      </button>
      {error ? <small className="text-danger">{error}</small> : null}
    </div>
  );
}
