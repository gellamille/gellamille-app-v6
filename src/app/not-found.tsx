import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="login-shell">
      <section className="card login-card">
        <h1>Az oldal nem található</h1>
        <p className="muted">A keresett oldal vagy adatlap nem létezik.</p>
        <Link className="button button-primary" href="/">Vissza a rendszerbe</Link>
      </section>
    </div>
  );
}
