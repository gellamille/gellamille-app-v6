import Link from 'next/link';
import { logoutAction } from '@/app/partner/actions';

export function PartnerShell({
  email,
  partnerName,
  children,
}: {
  email: string | null;
  partnerName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="portal-shell">
      <header className="portal-header">
        <Link href="/partner/catalog" className="partner-brand">
          <img
            src="/icon-192.png"
            width={46}
            height={46}
            alt="Gellamille"
            />
          <div>
            <div className="brand-title">Gellamille</div>
            <div className="brand-subtitle">
              {partnerName}
            </div>
          </div>
        </Link>

        <nav className="portal-nav" aria-label="Fő navigáció">
          <Link href="/partner/catalog">Új rendelés</Link>
          <Link href="/partner/orders">Rendeléseim</Link>
        </nav>

        <div className="portal-account">
          <span>{email}</span>
          <form action={logoutAction}>
            <button className="button button-ghost button-small" type="submit">
              Kilépés
            </button>
          </form>
        </div>
      </header>

      <main className="portal-content">{children}</main>
    </div>
  );
}
