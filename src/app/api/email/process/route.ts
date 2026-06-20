import { NextResponse } from "next/server";
import { requireSecret } from "@/lib/http";
import { processEmailOutbox } from "@/lib/email";

export async function POST(request: Request) {
  if (!requireSecret(request, process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  }
  const result = await processEmailOutbox(20);
  if (!result.enabled) return NextResponse.json({ error: "A RESEND_API_KEY vagy EMAIL_FROM nincs beállítva." }, { status: 503 });
  return NextResponse.json({ status: "ok", ...result });
}
