"use client";

import { FormEvent, useState } from "react";

export function SupportTicketForm() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setLoading(true);
    setMessage("");
    setStatus("idle");

    const response = await fetch("/api/partner/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: String(formData.get("subject") ?? ""),
        orderNumber: String(formData.get("orderNumber") ?? ""),
        priority: String(formData.get("priority") ?? "normal"),
        message: String(formData.get("message") ?? "")
      })
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setStatus("error");
      setMessage(data.error ?? "A panasz beküldése sikertelen.");
      return;
    }

    form.reset();
    setStatus("success");
    setMessage(`A panaszt rögzítettük. Ticket azonosító: #${data.ticket?.id ?? ""}`);
  }

  return (
    <form className="card stack support-ticket-form" onSubmit={submit}>
      <h2>Panasz vagy ügyfélszolgálati kérés</h2>
      <div className="form-grid">
        <label>Tárgy<input name="subject" required minLength={3} maxLength={180} placeholder="Röviden miről van szó?" /></label>
        <label>Kapcsolódó rendelés<input name="orderNumber" maxLength={80} placeholder="Pl. GM-ORD-2026-000012" /></label>
        <label>Sürgősség<select name="priority" defaultValue="normal"><option value="normal">Normál</option><option value="high">Fontos</option><option value="urgent">Sürgős</option></select></label>
        <label className="full">Leírás<textarea name="message" required minLength={10} maxLength={3000} placeholder="Írd le pontosan, miben tudunk segíteni." /></label>
      </div>
      {message ? <div className={status === "success" ? "alert alert-success" : "alert alert-danger"}>{message}</div> : null}
      <button className="button button-primary" disabled={loading}>{loading ? "Beküldés..." : "Ticket beküldése"}</button>
    </form>
  );
}
