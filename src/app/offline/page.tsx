export default function OfflinePage() {
  return (
    <main className="login-shell">
      <section className="card login-card">
        <h1>Nincs internetkapcsolat</h1>
        <p className="muted">
          Biztonsági okból a rendszer nem tárol és nem jelenít meg gyorsítótárból
          gyártási, készlet- vagy partneradatokat.
        </p>
        <p>Kapcsolódj az internethez, majd töltsd újra az oldalt.</p>
      </section>
    </main>
  );
}
