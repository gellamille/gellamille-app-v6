import { NextResponse } from "next/server";
import { one } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const database = await one<{ now: string; migration_008: boolean }>(`
      select now()::text as now,
             exists(select 1 from public.gellamille_schema_migrations where version='008') as migration_008
    `);
    return NextResponse.json({ status: "ok", service: "gellamille-app-v7", database });
  } catch (error) {
    return NextResponse.json({ status: "error", error: error instanceof Error ? error.message : "Adatbázishiba" }, { status: 500 });
  }
}
