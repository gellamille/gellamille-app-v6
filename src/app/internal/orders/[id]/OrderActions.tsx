"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrderActions({
  orderId,
  status,
  fulfillmentStatus
}: {
  orderId: number;
  status: string;
  fulfillmentStatus: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function action(name: string, extra: Record<string, unknown> = {}) {
    setBusy(true);
    setMessage("");
    const response = await fetch(`/api/orders/${orderId}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: name, ...extra })
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setMessage(data.error ?? "A művelet sikertelen.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="inline">
      {status === "submitted" || status === "stock_shortage" ? (
        <button className="button button-primary" disabled={busy} onClick={() => action("approve", { allowPartial: true })}>
          Elfogadás és foglalás
        </button>
      ) : null}
      {(status === "approved" || status === "partially_approved") && fulfillmentStatus !== "packed" ? (
        <button className="button" disabled={busy} onClick={() => action("allocate_fefo")}>FEFO összekészítés</button>
      ) : null}
      {fulfillmentStatus === "packed" || fulfillmentStatus === "partially_delivered" ? (
        <button className="button button-primary" disabled={busy} onClick={() => action("deliver_all")}>Átadás rögzítése</button>
      ) : null}
      {message ? <span className="text-danger">{message}</span> : null}
    </div>
  );
}
