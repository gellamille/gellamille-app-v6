"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { dateHU } from "@/lib/format";

export function PartnerPasswordNotice({
  required,
  expiresAt
}: {
  required: boolean;
  expiresAt: string | null | undefined;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const expired = required && expiresAt ? new Date(expiresAt) < new Date() : false;

  if (!required || done || dismissed) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (password !== confirm) return setMessage("A két jelszó nem egyezik.");
    setLoading(true);
    const response = await fetch("/api/partner/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) return setMessage(data.error ?? "A jelszó módosítása sikertelen.");
    setDone(true);
    router.refresh();
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-panel password-panel" role="dialog" aria-modal="true" aria-labelledby="partner-password-title">
        <div className="card-title-row">
          <h2 id="partner-password-title">Új jelszó szükséges</h2>
          <button className="icon-close-button" type="button" aria-label="Ablak bezárása" onClick={() => setDismissed(true)}>×</button>
        </div>
        {expired ? (
          <div className="stack">
            <div className="alert alert-danger">Az ideiglenes jelszó lejárt. Kérj új jelszót a Gellamille munkatársától.</div>
            <form action="/api/auth/signout" method="post">
              <button className="button button-primary">Kijelentkezés</button>
            </form>
          </div>
        ) : (
          <form className="stack" onSubmit={submit}>
            <p className="text-muted">Ideiglenes jelszóval léptél be. Kérlek, állíts be saját jelszót. Az ideiglenes jelszó lejárata: {dateHU(expiresAt)}.</p>
            <label>Új jelszó<input type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
            <label>Új jelszó újra<input type="password" minLength={8} value={confirm} onChange={(event) => setConfirm(event.target.value)} required /></label>
            {message ? <div className="alert alert-danger">{message}</div> : null}
            <button className="button button-primary" disabled={loading}>{loading ? "Mentés..." : "Jelszó mentése"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
