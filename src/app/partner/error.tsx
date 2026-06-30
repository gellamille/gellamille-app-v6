"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function PartnerError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Partner route error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <main className="partner-content">
      <section className="error-panel">
        <p className="error-kicker">Partner nézet hiba</p>
        <h1>Ez az oldal most nem töltött be.</h1>
        <p>A rendelési felület többi része tovább használható. Próbáld újra, vagy menj vissza a katalógushoz.</p>
        {error.digest ? <p className="error-digest">Hibakód: {error.digest}</p> : null}
        <div className="page-actions">
          <button type="button" className="button button-primary" onClick={reset}>Újrapróbálás</button>
          <Link href="/partner/catalog" className="button">Termékek</Link>
          <Link href="/partner/cart" className="button">Kosár</Link>
        </div>
      </section>
    </main>
  );
}
