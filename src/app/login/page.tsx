"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Hibás e-mail-cím vagy jelszó.");
      setLoading(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-logo">Gellamille</div>
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
      </section>
    </main>
  );
}
