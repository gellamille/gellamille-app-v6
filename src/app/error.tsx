"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("App route error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <main className="error-screen">
      <section className="error-panel">
        <p className="error-kicker">Rendszerhiba</p>
        <h1>Ez a nézet most nem töltött be.</h1>
        <p>A hiba naplózva lett. A munkát a főoldalról vagy egy újrapróbálással lehet folytatni.</p>
        {error.digest ? <p className="error-digest">Hibakód: {error.digest}</p> : null}
        <div className="page-actions">
          <button type="button" className="button button-primary" onClick={reset}>Újrapróbálás</button>
          <Link href="/" className="button">Főoldal</Link>
        </div>
      </section>
    </main>
  );
}
