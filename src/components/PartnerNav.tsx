"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, ClipboardList, LifeBuoy, LogOut } from "lucide-react";

export function PartnerNav() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    function refreshCartCount() {
      const raw = localStorage.getItem("gellamille-cart");
      if (!raw) {
        setCartCount(0);
        return;
      }
      try {
        const cart = JSON.parse(raw) as Record<string, number>;
        setCartCount(Object.values(cart).reduce((sum, quantity) => sum + Math.max(0, Number(quantity) || 0), 0));
      } catch {
        setCartCount(0);
      }
    }

    refreshCartCount();
    window.addEventListener("storage", refreshCartCount);
    window.addEventListener("gellamille-cart-updated", refreshCartCount);
    return () => {
      window.removeEventListener("storage", refreshCartCount);
      window.removeEventListener("gellamille-cart-updated", refreshCartCount);
    };
  }, []);

  return (
    <header className="partner-nav">
      <Link href="/partner" className="brand" aria-label="Gellamille partneri rendelő">
        <span className="partner-logo-mark" aria-hidden="true" />
      </Link>
      <nav>
        <Link href="/partner/catalog">Termékek</Link>
        <Link href="/partner/cart" className="partner-cart-link"><ShoppingCart size={17} /> Kosár{cartCount > 0 ? <span className="partner-cart-badge">{cartCount}</span> : null}</Link>
        <Link href="/partner/orders"><ClipboardList size={17} /> Rendeléseim</Link>
        <Link href="/partner/support"><LifeBuoy size={17} /> Ügyfélszolgálat</Link>
        <form action="/api/auth/signout" method="post">
          <button className="link-button"><LogOut size={17} /> Kilépés</button>
        </form>
      </nav>
    </header>
  );
}
