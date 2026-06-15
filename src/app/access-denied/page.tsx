import Link from 'next/link';

export const metadata = { title: 'Nincs partneri hozzáférés' };

export default function AccessDeniedPage() {
  return (
    <main className="login-shell">
      <section className="login-card">
        <h1>Nincs partneri hozzáférés</h1>
        <p className="muted">
          Ez a fiók nincs aktív partnerhez rendelve. Keresd a Gellamille
          kapcsolattartódat.
        </p>
        <Link className="button button-primary" href="/login">
          Vissza a belépéshez
        </Link>
      </section>
    </main>
  );
}
