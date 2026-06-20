export default function AccessPendingPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-logo">Gellamille</div>
        <h1>Hozzáférésre vár</h1>
        <p>A fiók létrejött, de egy adminisztrátornak még aktiválnia kell.</p>
        <form action="/api/auth/signout" method="post">
          <button className="button">Kilépés</button>
        </form>
      </section>
    </main>
  );
}
