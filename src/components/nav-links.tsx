'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  ['/internal/lots/new', 'Új LOT'],
  ['/internal/lots', 'Gyártási napló'],
  ['/internal/inventory', 'Készlet'],
  ['/internal/products', 'Termékek'],
  ['/internal/orders', 'Rendelések'],
  ['/internal/shipments', 'Szállítmányok'],
  ['/internal/partners', 'Partnerek'],
  ['/internal/analytics', 'Elemzés'],
] as const;

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="nav" aria-label="Fő navigáció">
      {links.map(([href, label]) => (
        <Link key={href} href={href} data-active={pathname === href || (href !== '/internal/lots' && pathname.startsWith(`${href}/`))}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
