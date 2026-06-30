"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Hibás e-mail-cím vagy jelszó.");
      setLoading(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  async function requestPasswordReset() {
    setResetMessage("");
    if (!email.trim()) {
      setResetMessage("Add meg az e-mail-címedet, és utána kérj jelszó-visszaállítást.");
      return;
    }
    setResetLoading(true);
    const response = await fetch("/api/auth/password-reset-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    setResetLoading(false);
    if (!response.ok) {
      setResetMessage("A kérés beküldése sikertelen.");
      return;
    }
    setResetMessage("A jelszó-visszaállítási kérést elküldtük. A Gellamille munkatársai új ideiglenes jelszót adnak.");
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-logo">
          <Image src="/login-logo.png" alt="Gellamille" width={3626} height={973} priority />
        </div>
        <h1>Belépés</h1>
        <p>Belső rendszer és partneri rendelési felület.</p>
        <form onSubmit={submit} className="stack">
          <label>
            E-mail-cím
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Jelszó
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error ? <div className="alert alert-danger">{error}</div> : null}
          <button className="button button-primary" disabled={loading}>
            {loading ? "Belépés…" : "Belépés"}
          </button>
        </form>
        <div className="section-gap-small stack">
          <button className="button" type="button" disabled={resetLoading} onClick={requestPasswordReset}>
            {resetLoading ? "Kérés küldése..." : "Elfelejtett jelszó / új ideiglenes jelszó kérése"}
          </button>
          {resetMessage ? <div className={resetMessage.includes("elküldtük") ? "alert alert-success" : "alert alert-warning"}>{resetMessage}</div> : null}
        </div>
      </section>
    </main>
  );
}
