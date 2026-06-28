"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteOrderButton({ orderId }: { orderId: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function deleteOrder() {
    const reason = window.prompt("Miért töröljük ezt a rendelést? Legalább 5 karakteres indoklás szükséges.");
    if (!reason) return;
    setBusy(true);
    setMessage("");
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason })
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setMessage(data.error ?? "A rendelés törlése sikertelen.");
      return;
    }
    router.push("/internal/orders");
    router.refresh();
  }

  return (
    <>
      <button className="button button-danger" disabled={busy} onClick={deleteOrder}>Törlés</button>
      {message ? <span className="text-danger">{message}</span> : null}
    </>
  );
}
