"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrderActions({
  orderId,
  status,
  fulfillmentStatus,
  canDeliver,
  hasMissingReservation
}: {
  orderId: number;
  status: string;
  fulfillmentStatus: string;
  canDeliver: boolean;
  hasMissingReservation: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const canApprove = status === "submitted" || status === "stock_shortage" || (status === "partially_approved" && hasMissingReservation);
  const canPick = (status === "approved" || status === "partially_approved") && !canDeliver && !["delivered", "cancelled"].includes(fulfillmentStatus);
  const approveLabel = status === "stock_shortage"
    ? "Készlet újraellenőrzése és foglalás"
    : status === "partially_approved"
      ? "Hiányzó készlet újrafoglalása"
      : "Elfogadás és foglalás";

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
      {canApprove ? (
        <button className="button button-primary" disabled={busy} onClick={() => action("approve", { allowPartial: true })}>
          {approveLabel}
        </button>
      ) : null}
      {canPick ? (
        <button className="button" disabled={busy} onClick={() => action("allocate_fefo")}>FEFO összekészítés</button>
      ) : null}
      {canDeliver && (fulfillmentStatus === "packed" || fulfillmentStatus === "partially_delivered") ? (
        <button className="button button-primary" disabled={busy} onClick={() => action("deliver_all")}>Átadás és követelés</button>
      ) : null}
      {message ? <span className="text-danger">{message}</span> : null}
    </div>
  );
}
