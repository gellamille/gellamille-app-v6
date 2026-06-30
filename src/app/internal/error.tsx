"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function InternalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Internal route error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <div className="page">
      <section className="error-panel">
        <p className="error-kicker">Műveleti nézet hiba</p>
        <h1>Ez az oldal most nem töltött be.</h1>
        <p>A menü továbbra is használható. Próbáld újra, vagy válts át egy másik munkanézetre.</p>
        {error.digest ? <p className="error-digest">Hibakód: {error.digest}</p> : null}
        <div className="page-actions">
          <button type="button" className="button button-primary" onClick={reset}>Újrapróbálás</button>
          <Link href="/internal" className="button">Vezérlőpult</Link>
          <Link href="/internal/orders" className="button">Rendelések</Link>
          <Link href="/internal/inventory/cartons/check" className="button">Karton ellenőrzés</Link>
        </div>
      </section>
    </div>
  );
}
