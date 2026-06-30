import { NextResponse } from "next/server";
import { requireSecret } from "@/lib/http";
import { emailRuntimeStatus, processEmailOutbox } from "@/lib/email";

export async function GET(request: Request) {
  if (!requireSecret(request, process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  }
  return NextResponse.json({ status: "ok", email: emailRuntimeStatus() });
}

export async function POST(request: Request) {
  if (!requireSecret(request, process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  }
  const result = await processEmailOutbox(20);
  if (!result.enabled) return NextResponse.json({ error: `Az e-mail küldés nincs élesítve. Hiányzó beállítás: ${result.missing.join(", ") || "EMAIL_DELIVERY_MODE"}.`, email: result }, { status: 503 });
  return NextResponse.json({ status: "ok", ...result });
}
