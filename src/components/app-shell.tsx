import Link from 'next/link';
import { NavLinks } from './nav-links';
import { logoutAction } from '@/app/internal/actions';

export function AppShell({ email, children }: { email: string | null; children: React.ReactNode }) {
  return (
    <div className="page-shell">
      <div className="app-grid">
        <aside className="sidebar">
          <Link className="brand" href="/internal/lots/new">
            <img src="/icon-192.png" width={46} height={46} alt="Gellamille" />
            <div>
              <div className="brand-title">Gellamille</div>
              <div className="brand-subtitle">Belső rendszer</div>
            </div>
          </Link>
          <NavLinks />
          <div className="sidebar-footer">
            <div>{email}</div>
            <form action={logoutAction} className="logout-form">
              <button className="button button-ghost button-small" type="submit">Kilépés</button>
            </form>
          </div>
        </aside>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
