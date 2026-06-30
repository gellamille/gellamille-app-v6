"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Global application error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <html lang="hu">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f3f2ed", color: "#1f2a25", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
          <section style={{ width: "min(560px, 100%)", background: "#fff", border: "1px solid #dde1dc", borderRadius: 14, padding: 24, boxShadow: "0 10px 30px rgba(31, 42, 37, 0.07)" }}>
            <p style={{ margin: "0 0 8px", color: "#a7473f", fontSize: 12, fontWeight: 850, textTransform: "uppercase", letterSpacing: ".05em" }}>Rendszerhiba</p>
            <h1 style={{ margin: "0 0 10px", fontSize: 26 }}>Az alkalmazás nem tudta betölteni ezt a nézetet.</h1>
            <p style={{ margin: "0 0 16px", color: "#6f7872" }}>A hiba naplózva lett. Próbáld újra, vagy lépj vissza a kezdőoldalra.</p>
            {error.digest ? <p style={{ margin: "0 0 16px", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", color: "#6f7872" }}>Hibakód: {error.digest}</p> : null}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button type="button" onClick={reset} style={{ border: "1px solid #405147", background: "#405147", color: "#fff", borderRadius: 9, padding: "9px 13px", fontWeight: 700 }}>Újrapróbálás</button>
              <button type="button" onClick={() => { window.location.href = "/"; }} style={{ border: "1px solid #dde1dc", background: "#fff", color: "#1f2a25", borderRadius: 9, padding: "9px 13px", fontWeight: 700 }}>Főoldal</button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
