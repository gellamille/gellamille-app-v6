import { NextResponse } from "next/server";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { query } from "@/lib/db";

const ROLES = ["admin", "management", "staff", "production", "warehouse", "finance", "sales"];

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await apiUser(ROLES);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const { id } = await params;
    const notificationId = Number(id);
    if (!Number.isInteger(notificationId) || notificationId <= 0) throw new Error("Hibás értesítésazonosító.");

    const rows = await query<{ id: number }>(`
      update public.notifications
         set read_at=coalesce(read_at, now())
       where id=$1
         and organization_id=$2
         and (
           user_id=$3::uuid
           or (user_id is null and (role_code is null or role_code=$4))
         )
       returning id
    `, [notificationId, user.organization_id, user.user_id, user.role]);

    if (!rows[0]) throw new Error("Az értesítés nem található.");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "Az értesítés megnyitása sikertelen.");
  }
}
