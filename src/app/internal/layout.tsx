import { InternalNav } from "@/components/InternalNav";
import { INTERNAL_ROLES, requireAppUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function InternalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAppUser(INTERNAL_ROLES);

  return (
    <div className="app-shell">
      <InternalNav role={user.role} />
      <main className="content">
        <div className="topbar">
          <span>{user.display_name ?? user.email}</span>
          <span className="role-pill">{user.role}</span>
        </div>
        {children}
      </main>
    </div>
  );
}
