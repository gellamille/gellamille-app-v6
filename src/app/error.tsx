'use client';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="login-shell">
      <section className="card login-card">
        <h1>Az oldal nem tölthető be</h1>
        <p className="muted">A rendszer nem tudta lekérni a szükséges adatokat.</p>
        <button className="button button-primary" type="button" onClick={reset}>Újrapróbálás</button>
      </section>
    </div>
  );
}
