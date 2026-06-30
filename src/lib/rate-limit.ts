import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { logWarning, reportError } from "@/lib/monitoring";

type RateLimitOptions = {
  scope: string;
  identifier: string;
  limit: number;
  windowSeconds: number;
};

export const RATE_LIMITS = {
  loginIp: { scope: "auth.login.ip", limit: 20, windowSeconds: 15 * 60 },
  loginEmail: { scope: "auth.login.email", limit: 8, windowSeconds: 15 * 60 },
  loginEmailIp: { scope: "auth.login.email_ip", limit: 5, windowSeconds: 15 * 60 },
  passwordResetIp: { scope: "auth.password_reset.ip", limit: 5, windowSeconds: 60 * 60 },
  passwordResetEmail: { scope: "auth.password_reset.email", limit: 3, windowSeconds: 60 * 60 },
  partnerApiIp: { scope: "partner.api.ip", limit: 120, windowSeconds: 15 * 60 },
  partnerApiUser: { scope: "partner.api.user", limit: 240, windowSeconds: 15 * 60 },
  partnerOrderSubmit: { scope: "partner.order_submit.partner", limit: 12, windowSeconds: 60 * 60 },
  partnerOrderWithdraw: { scope: "partner.order_withdraw.partner", limit: 20, windowSeconds: 60 * 60 },
  partnerTicketSubmit: { scope: "partner.ticket_submit.partner", limit: 8, windowSeconds: 60 * 60 },
  partnerTicketMessage: { scope: "partner.ticket_message.partner", limit: 30, windowSeconds: 60 * 60 },
  partnerPasswordChange: { scope: "partner.password_change.user", limit: 5, windowSeconds: 60 * 60 }
} as const;

export function rateLimitOption(
  preset: { scope: string; limit: number; windowSeconds: number },
  identifier: string
): RateLimitOptions {
  return { ...preset, identifier };
}

export function requestIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded
    || request.headers.get("x-real-ip")
    || request.headers.get("cf-connecting-ip")
    || "unknown";
}

export function rateLimitKey(value: string) {
  const salt = process.env.RATE_LIMIT_SALT || process.env.CRON_SECRET;
  if (!salt) {
    throw new Error("A RATE_LIMIT_SALT vagy CRON_SECRET környezeti változó hiányzik.");
  }
  return crypto.createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

export function rateLimitResponse(retryAfter: number) {
  return NextResponse.json(
    { error: "Túl sok kérés. Kérlek, próbáld újra később." },
    { status: 429, headers: { "Retry-After": String(Math.max(1, retryAfter)) } }
  );
}

export async function checkRateLimit(options: RateLimitOptions) {
  try {
    if (!process.env.RATE_LIMIT_SALT && !process.env.CRON_SECRET) {
      logWarning("rate_limit.disabled_missing_salt", { scope: options.scope });
      return { allowed: true, attempts: 0, retryAfterSeconds: 0 };
    }

    const rows = await query<{ attempts: number; retry_after_seconds: number }>(`
      with upserted as (
        insert into public.rate_limit_counters(scope,identifier_hash,window_start,window_seconds,attempts)
        values($1,$2,now(),$3,1)
        on conflict(scope,identifier_hash) do update set
          attempts=case
            when rate_limit_counters.window_start + (rate_limit_counters.window_seconds::text || ' seconds')::interval <= now()
              then 1
            else rate_limit_counters.attempts + 1
          end,
          window_start=case
            when rate_limit_counters.window_start + (rate_limit_counters.window_seconds::text || ' seconds')::interval <= now()
              then now()
            else rate_limit_counters.window_start
          end,
          window_seconds=excluded.window_seconds,
          updated_at=now()
        returning attempts,window_start,window_seconds
      )
      select attempts,
             greatest(1,ceil(extract(epoch from (window_start + (window_seconds::text || ' seconds')::interval - now()))))::int as retry_after_seconds
        from upserted
    `, [options.scope, rateLimitKey(options.identifier), options.windowSeconds]);
    const row = rows[0];
    const allowed = Number(row?.attempts ?? 0) <= options.limit;
    if (!allowed) {
      logWarning("rate_limit.exceeded", {
        scope: options.scope,
        limit: options.limit,
        windowSeconds: options.windowSeconds,
        retryAfterSeconds: row.retry_after_seconds
      });
    }
    return {
      allowed,
      attempts: Number(row?.attempts ?? 0),
      retryAfterSeconds: Number(row?.retry_after_seconds ?? options.windowSeconds)
    };
  } catch (error) {
    reportError(error, { route: "rate-limit", scope: options.scope });
    return { allowed: true, attempts: 0, retryAfterSeconds: 0 };
  }
}

export async function enforceRateLimit(options: RateLimitOptions) {
  const result = await checkRateLimit(options);
  return result.allowed ? null : rateLimitResponse(result.retryAfterSeconds);
}

export async function enforceRateLimits(options: RateLimitOptions[]) {
  for (const option of options) {
    const response = await enforceRateLimit(option);
    if (response) return response;
  }
  return null;
}
