import Link from "next/link";
import { IceCreamBowl, ShoppingCart, ClipboardList, LogOut } from "lucide-react";

export function PartnerNav() {
  return (
    <header className="partner-nav">
      <Link href="/partner" className="brand">
        <IceCreamBowl size={22} />
        <span>Gellamille rendelés</span>
      </Link>
      <nav>
        <Link href="/partner/catalog">Termékek</Link>
        <Link href="/partner/cart"><ShoppingCart size={17} /> Kosár</Link>
        <Link href="/partner/orders"><ClipboardList size={17} /> Rendeléseim</Link>
        <form action="/api/auth/signout" method="post">
          <button className="link-button"><LogOut size={17} /> Kilépés</button>
        </form>
      </nav>
    </header>
  );
}
