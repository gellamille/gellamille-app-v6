import { requireAppUser } from "@/lib/auth";

export async function RoleGuard({ roles, children }: { roles: string[]; children: React.ReactNode }) {
  await requireAppUser(roles);
  return children;
}
