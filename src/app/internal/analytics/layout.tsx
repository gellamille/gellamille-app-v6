import { RoleGuard } from "@/components/RoleGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RoleGuard roles={["admin", "management", "sales", "finance"]}>{children}</RoleGuard>;
}
