import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { one } from "@/lib/db";
import type { AppUser } from "@/lib/auth";

type ApiAuthResult =
  | { error: NextResponse; user: null }
  | { error: null; user: AppUser };

export async function apiUser(allowedRoles?: string[]): Promise<ApiAuthResult> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: NextResponse.json({ error: "Nincs bejelentkezve." }, { status: 401 }), user: null };

  const appUser = await one<AppUser>(
    `select user_id, email, display_name, role, partner_id, active, organization_id
       from public.app_users where user_id = $1`,
    [user.id]
  );

  if (!appUser?.active) return { error: NextResponse.json({ error: "A hozzáférés nincs aktiválva." }, { status: 403 }), user: null };
  if (allowedRoles?.length && !allowedRoles.includes(appUser.role)) {
    return { error: NextResponse.json({ error: "Nincs jogosultsága." }, { status: 403 }), user: null };
  }
  return { error: null, user: appUser };
}
