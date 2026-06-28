import { redirect } from "next/navigation";
import { createSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { one } from "@/lib/db";

export type AppUser = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  role: string;
  partner_id: number | null;
  active: boolean;
  organization_id: number | null;
  password_change_required?: boolean;
  temporary_password_expires_at?: string | null;
  password_changed_at?: string | null;
};

export async function currentAppUser(): Promise<AppUser | null> {
  if (!hasSupabaseConfig()) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  return one<AppUser>(
    `select user_id, email, display_name, role, partner_id, active, organization_id,
            password_change_required, temporary_password_expires_at, password_changed_at
       from public.app_users
      where user_id = $1`,
    [user.id]
  );
}

export async function requireAppUser(allowedRoles?: string[]): Promise<AppUser> {
  const user = await currentAppUser();

  if (!user) { redirect("/login"); throw new Error("Nincs bejelentkezve."); }
  if (!user.active) redirect("/access-pending");

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    redirect(user.role === "partner" ? "/partner" : "/internal");
  }

  return user;
}

export const INTERNAL_ROLES = [
  "admin",
  "management",
  "staff",
  "production",
  "warehouse",
  "finance",
  "sales"
];

export const ADMIN_ROLES = ["admin", "management"];
