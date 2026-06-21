import { PartnerNav } from "@/components/PartnerNav";
import { requireAppUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PartnerLayout({ children }: { children: React.ReactNode }) {
  await requireAppUser(["partner"]);
  return (
    <div className="partner-shell">
      <PartnerNav />
      <main className="partner-content">{children}</main>
    </div>
  );
}
