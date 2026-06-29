"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SupportTicketControls({ ticketId, status }: { ticketId: number; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function updateStatus(nextStatus: string) {
    setLoading(true);
    setError("");
    const response = await fetch(`/api/support/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "Az állapot módosítása sikertelen.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="support-ticket-controls">
      <button className="button button-small" disabled={loading || status === "in_progress"} onClick={() => updateStatus("in_progress")}>Folyamatban</button>
      <button className="button button-small" disabled={loading || status === "waiting_partner"} onClick={() => updateStatus("waiting_partner")}>Partner válaszára vár</button>
      <button className="button button-small button-primary" disabled={loading || status === "closed"} onClick={() => updateStatus("closed")}>Lezárás</button>
      {error ? <div className="alert alert-danger">{error}</div> : null}
    </div>
  );
}
