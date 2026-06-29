"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { dateHU } from "@/lib/format";

type Message = {
  id: number;
  sender_role: string;
  sender_name?: string | null;
  body: string;
  created_at: string;
};

export function SupportConversation({
  ticketId,
  messages,
  currentSide,
  disabled = false
}: {
  ticketId: number;
  messages: Message[];
  currentSide: "partner" | "internal";
  disabled?: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError("");
    const response = await fetch(`/api/support/tickets/${ticketId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body })
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "Az üzenet mentése sikertelen.");
      return;
    }
    setBody("");
    router.refresh();
  }

  return (
    <section className="support-conversation">
      <div className="support-message-list">
        {messages.map((message) => {
          const mine = message.sender_role === currentSide || (currentSide === "internal" && message.sender_role === "internal");
          return (
            <article className={`support-message ${mine ? "is-mine" : ""}`} key={message.id}>
              <div className="support-message-meta">
                <strong>{message.sender_role === "partner" ? "Partner" : message.sender_name ?? "Gellamille"}</strong>
                <span>{dateHU(message.created_at)}</span>
              </div>
              <p>{message.body}</p>
            </article>
          );
        })}
        {!messages.length ? <div className="empty-state">Még nincs üzenet ebben a ticketben.</div> : null}
      </div>
      {disabled ? <div className="alert alert-warning">Ez a ticket már lezárt, új üzenet nem küldhető.</div> : null}
      {!disabled ? (
        <form className="support-reply-form" onSubmit={submit}>
          <textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Válasz írása..." maxLength={3000} />
          {error ? <div className="alert alert-danger">{error}</div> : null}
          <button className="button button-primary" disabled={loading || !body.trim()}>{loading ? "Küldés..." : "Üzenet küldése"}</button>
        </form>
      ) : null}
    </section>
  );
}
