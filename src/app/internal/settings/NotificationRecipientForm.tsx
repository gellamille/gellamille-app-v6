"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const eventTypes = [
  ["new_order", "Új rendelés érkezett"],
  ["order_changed", "Rendelés módosult"],
  ["product_recall", "Termékvisszahívás"]
] as const;

export function NotificationRecipientForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/admin/notification-recipients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: String(fd.get("eventType") ?? "new_order"),
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? "")
      })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "A címzett mentése sikertelen.");
      return;
    }
    form.reset();
    setMessage("Az e-mail címzett mentve.");
    router.refresh();
  }

  return (
    <form className="card stack" onSubmit={submit}>
      <h3>E-mail értesítési címzett</h3>
      <div className="form-grid">
        <label>Esemény<select name="eventType" defaultValue="new_order">{eventTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>Név<input name="name" /></label>
        <label className="full">E-mail<input name="email" type="email" required /></label>
      </div>
      {message ? <div className={message.includes("mentve") ? "alert alert-success" : "alert alert-danger"}>{message}</div> : null}
      <button className="button button-primary" disabled={loading}>Címzett mentése</button>
    </form>
  );
}
