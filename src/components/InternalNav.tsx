import Link from "next/link";
import Image from "next/image";
import {
  Boxes, ClipboardList, Factory, LayoutDashboard, Truck,
  WalletCards, Users, ListTodo, FlaskConical, ChartNoAxesCombined,
  Settings, LogOut, IceCreamBowl, AlertTriangle, ScanBarcode, ArrowRightLeft
} from "lucide-react";

const navGroups = [
  {
    title: "Napi munka",
    items: [
      ["/internal", "Vezérlőpult", LayoutDashboard, ["admin","management","staff","production","warehouse","finance","sales"]],
      ["/internal/orders", "Rendelések", ClipboardList, ["admin","management","staff","sales","warehouse","finance"]],
      ["/internal/shipments", "Szállítás", Truck, ["admin","management","staff","warehouse","sales"]],
      ["/internal/production", "Gyártás és LOT", Factory, ["admin","management","staff","production"]],
      ["/internal/tasks", "Feladatok", ListTodo, ["admin","management","staff","sales"]]
    ]
  },
  {
    title: "Készlet és raktár",
    items: [
      ["/internal/inventory", "Készlet", Boxes, ["admin","management","staff","production","warehouse"]],
      ["/internal/inventory/cartons", "Kartonok", Boxes, ["admin","management","staff","production","warehouse"]],
      ["/internal/inventory/cartons/check", "Karton ellenőrzés", ScanBarcode, ["admin","management","staff","production","warehouse"]],
      ["/internal/inventory/cartons/move", "Karton áthelyezés", ArrowRightLeft, ["admin","management","production","warehouse"]],
      ["/internal/inventory/cartons/scanner-test", "Scanner teszt", ScanBarcode, ["admin","management","staff","production","warehouse"]]
    ]
  },
  {
    title: "Gyártás",
    items: [
      ["/internal/materials", "Alapanyagok", FlaskConical, ["admin","management","staff","production"]],
      ["/internal/products", "Termékek", IceCreamBowl, ["admin","management","staff","production","sales"]],
      ["/internal/recalls", "Visszahívás", AlertTriangle, ["admin","management","staff","production","warehouse","sales"]]
    ]
  },
  {
    title: "Üzlet",
    items: [
      ["/internal/partners", "Partnerek", Users, ["admin","management","sales","finance"]],
      ["/internal/finance", "Pénzügy", WalletCards, ["admin","management","finance"]],
      ["/internal/analytics", "Elemzések", ChartNoAxesCombined, ["admin","management","sales","finance"]]
    ]
  },
  {
    title: "Admin",
    items: [
      ["/internal/settings", "Beállítások", Settings, ["admin"]]
    ]
  }
] as const;

export function InternalNav({ role, submittedOrders = 0 }: { role: string; submittedOrders?: number }) {
  const groups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(([, , , roles]) => (roles as readonly string[]).includes(role))
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside className="sidebar">
      <Link href="/internal" className="brand internal-brand">
        <Image className="internal-logo-image" src="/gellamille-logo.png" alt="Gellamille" width={3956} height={1062} priority />
      </Link>
      <nav>
        {groups.map((group) => (
          <div className="nav-group" key={group.title}>
            <div className="nav-group-title">{group.title}</div>
            {group.items.map(([href, label, Icon]) => (
              <Link href={href} key={href}><Icon size={18} /><span>{label}</span>{href === "/internal/orders" && submittedOrders > 0 ? <span className="nav-badge">{submittedOrders}</span> : null}</Link>
            ))}
          </div>
        ))}
      </nav>
      <form action="/api/auth/signout" method="post" className="sidebar-bottom">
        <button className="nav-button" type="submit"><LogOut size={18} /> Kilépés</button>
      </form>
    </aside>
  );
}
