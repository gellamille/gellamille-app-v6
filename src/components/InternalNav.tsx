"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Boxes, ClipboardList, Factory, LayoutDashboard, Truck,
  WalletCards, Users, ListTodo, FlaskConical, ChartNoAxesCombined,
  Settings, LogOut, IceCreamBowl, AlertTriangle, ScanBarcode, ArrowRightLeft,
  BriefcaseBusiness, Warehouse, Store, ShieldCheck, FileText, LifeBuoy, Menu, X
} from "lucide-react";

const navGroups = [
  {
    title: "Napi munka",
    Icon: BriefcaseBusiness,
    items: [
      ["/internal", "Vezérlőpult", LayoutDashboard, ["admin","management","staff","production","warehouse","finance","sales"]],
      ["/internal/orders", "Rendelések", ClipboardList, ["admin","management","staff","sales","warehouse","finance"]],
      ["/internal/shipments", "Szállítás", Truck, ["admin","management","staff","warehouse","sales"]],
      ["/internal/production", "Gyártás és LOT", Factory, ["admin","management","staff","production"]],
      ["/internal/support", "Ügyfélszolgálat", LifeBuoy, ["admin","management","staff","sales","finance"]],
      ["/internal/tasks", "Feladatok", ListTodo, ["admin","management","staff","sales","production"]]
    ]
  },
  {
    title: "Készlet és raktár",
    Icon: Warehouse,
    items: [
      ["/internal/inventory", "Készlet", Boxes, ["admin","management","staff","production","warehouse"]],
      ["/internal/inventory/cartons", "Kartonok", Boxes, ["admin","management","staff","production","warehouse"]],
      ["/internal/inventory/cartons/check", "Karton ellenőrzés", ScanBarcode, ["admin","management","staff","production","warehouse"]],
      ["/internal/inventory/cartons/move", "Karton áthelyezés", ArrowRightLeft, ["admin","management","production","warehouse"]],
      ["/internal/inventory/cartons/scanner-test", "Scanner teszt", ScanBarcode, ["admin","management","staff","production","warehouse"]]
    ]
  },
  {
    title: "Üzlet",
    Icon: Store,
    items: [
      ["/internal/partners", "Partnerek", Users, ["admin","management","sales","finance"]],
      ["/internal/billing", "Számlázás", FileText, ["admin","management","finance"]],
      ["/internal/finance", "Pénzügy", WalletCards, ["admin","management","finance"]],
      ["/internal/analytics", "Elemzések", ChartNoAxesCombined, ["admin","management","sales","finance"]]
    ]
  },
  {
    title: "Admin",
    Icon: ShieldCheck,
    items: [
      ["/internal/materials", "Alapanyagok", FlaskConical, ["admin","management","staff","production"]],
      ["/internal/products", "Termékek", IceCreamBowl, ["admin","management","staff","production","sales"]],
      ["/internal/recalls", "Visszahívás", AlertTriangle, ["admin","management","staff","production","warehouse","sales"]],
      ["/internal/settings", "Beállítások", Settings, ["admin"]]
    ]
  }
] as const;

export function InternalNav({ role, submittedOrders = 0, openSupportTickets = 0 }: { role: string; submittedOrders?: number; openSupportTickets?: number }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const groups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(([, , , roles]) => (roles as readonly string[]).includes(role))
    }))
    .filter((group) => group.items.length > 0);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("mobile-nav-open", mobileOpen);
    return () => document.body.classList.remove("mobile-nav-open");
  }, [mobileOpen]);

  return (
    <>
      <button
        className="mobile-menu-button"
        type="button"
        aria-label={mobileOpen ? "Menü bezárása" : "Menü megnyitása"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <button
        className={`mobile-nav-backdrop${mobileOpen ? " is-open" : ""}`}
        type="button"
        aria-label="Menü bezárása"
        onClick={() => setMobileOpen(false)}
      />
      <aside className={`sidebar${mobileOpen ? " is-mobile-open" : ""}`}>
        <Link href="/internal" className="brand internal-brand">
          <Image className="internal-logo-image" src="/gellamille-logo.png" alt="Gellamille" width={3956} height={1062} priority />
        </Link>
        <nav>
          {groups.map((group) => (
            <details className="nav-group" key={group.title} open>
              <summary className="nav-group-title"><group.Icon size={17} /><span>{group.title}</span></summary>
              <div className="nav-submenu">
                {group.items.map(([href, label, Icon]) => {
                  const exact = pathname === href;
                  const nested = href !== "/internal" && pathname.startsWith(`${href}/`);
                  const hasMoreSpecificMatch = group.items.some(([otherHref]) => (
                    otherHref !== href &&
                    otherHref.startsWith(`${href}/`) &&
                    (pathname === otherHref || pathname.startsWith(`${otherHref}/`))
                  ));
                  const isActive = exact || (nested && !hasMoreSpecificMatch);
                  return (
                    <Link className={isActive ? "is-active" : undefined} href={href} key={href} aria-current={isActive ? "page" : undefined}>
                      <Icon size={17} /><span>{label}</span>{href === "/internal/orders" && submittedOrders > 0 ? <span className="nav-badge">{submittedOrders}</span> : null}{href === "/internal/support" && openSupportTickets > 0 ? <span className="nav-badge">{openSupportTickets}</span> : null}
                    </Link>
                  );
                })}
              </div>
            </details>
          ))}
        </nav>
        <form action="/api/auth/signout" method="post" className="sidebar-bottom">
          <button className="nav-button" type="submit"><LogOut size={18} /> Kilépés</button>
        </form>
      </aside>
    </>
  );
}
