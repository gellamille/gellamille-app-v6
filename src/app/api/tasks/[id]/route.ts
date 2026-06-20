import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { query } from "@/lib/db";

const schema = z.object({ status: z.enum(["open", "in_progress", "done", "cancelled"]) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await apiUser(["admin", "management", "sales"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;
  try {
    const input = schema.parse(await request.json());
    const { id } = await params;
    const rows = await query<any>(`
      update public.tasks set status=$3,
        completed_at=case when $3='done' then now() else null end
       where id=$1 and organization_id=$2 and archived_at is null returning *
    `, [Number(id), user.organization_id, input.status]);
    if (!rows[0]) throw new Error("A feladat nem található.");
    return NextResponse.json(rows[0]);
  } catch (error) {
    return apiError(error, "A feladat módosítása sikertelen.");
  }
}
