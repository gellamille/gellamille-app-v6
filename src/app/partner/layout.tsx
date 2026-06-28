import { PartnerNav } from "@/components/PartnerNav";
import { PartnerPasswordNotice } from "@/components/PartnerPasswordNotice";
import { requireAppUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PartnerLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAppUser(["partner"]);
  return (
    <div className="partner-shell">
      <PartnerNav />
      <PartnerPasswordNotice required={Boolean(user.password_change_required)} expiresAt={user.temporary_password_expires_at} />
      <main className="partner-content">{children}</main>
    </div>
  );
}
