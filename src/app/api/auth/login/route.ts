import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/http";
import { enforceRateLimits, RATE_LIMITS, rateLimitOption, requestIp } from "@/lib/rate-limit";
import { createSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { logInfo, logWarning } from "@/lib/monitoring";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(256)
});

export async function POST(request: Request) {
  const ip = requestIp(request);

  try {
    if (!hasSupabaseConfig()) {
      return NextResponse.json({ error: "A Supabase kapcsolat nincs beállítva." }, { status: 503 });
    }

    const input = schema.parse(await request.json());
    const email = input.email.trim().toLowerCase();
    const limited = await enforceRateLimits([
      rateLimitOption(RATE_LIMITS.loginIp, ip),
      rateLimitOption(RATE_LIMITS.loginEmail, email),
      rateLimitOption(RATE_LIMITS.loginEmailIp, `${email}:${ip}`)
    ]);
    if (limited) return limited;

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: input.password });
    if (error) {
      logWarning("auth.login.failed", { ip, emailDomain: email.split("@")[1] ?? "" });
      return NextResponse.json({ error: "Hibás e-mail-cím vagy jelszó." }, { status: 401 });
    }

    logInfo("auth.login.success", { ip, emailDomain: email.split("@")[1] ?? "" });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "A belépés sikertelen.", { route: "/api/auth/login", ip });
  }
}
