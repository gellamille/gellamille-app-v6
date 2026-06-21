import Link from "next/link";
import {
  Boxes, ClipboardList, Factory, LayoutDashboard, PackageCheck,
  Users, LogOut
} from "lucide-react";

const nav = [
  ["/internal", "Vezérlőpult", LayoutDashboard, ["admin","management","staff","production","warehouse","finance","sales"]],
  ["/internal/orders", "Rendelések", ClipboardList, ["admin","management","staff","sales","warehouse","finance"]],
  ["/internal/production", "Gyártás és LOT", Factory, ["admin","management","staff","production"]],
  ["/internal/inventory", "Készlet", Boxes, ["admin","management","staff","production","warehouse"]],
  ["/internal/partners", "Partnerek", Users, ["admin","management","sales","finance"]]
] as const;

export function InternalNav({ role }: { role: string }) {
  return (
    <aside className="sidebar">
      <Link href="/internal" className="brand"><PackageCheck size={23} /><span>Gellamille</span></Link>
      <nav>
        {nav.filter(([, , , roles]) => (roles as readonly string[]).includes(role)).map(([href, label, Icon]) => (
          <Link href={href} key={href}><Icon size={18} /><span>{label}</span></Link>
        ))}
      </nav>
      <form action="/api/auth/signout" method="post" className="sidebar-bottom">
        <button className="nav-button" type="submit"><LogOut size={18} /> Kilépés</button>
      </form>
    </aside>
  );
}
