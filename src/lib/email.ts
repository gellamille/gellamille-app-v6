import { query } from "@/lib/db";

type EmailDeliveryMode = "disabled" | "dry_run" | "live";
type EmailProvider = "resend";

type EmailOutboxRow = {
  id: number;
  recipient_email: string;
  subject: string;
  body_text: string;
  body_html: string | null;
  attempts: number;
};

type ProcessedEmail = {
  id: number;
  status: "sent" | "failed";
  recipient: string;
  providerMessageId?: string;
  error?: string;
};

function emailDeliveryMode(): EmailDeliveryMode {
  const value = process.env.EMAIL_DELIVERY_MODE;
  if (value === "disabled" || value === "dry_run" || value === "live") return value;
  if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM && process.env.RESEND_API_URL) return "live";
  return "disabled";
}

function emailProvider(): EmailProvider {
  return "resend";
}

function missingEmailConfig() {
  const missing: string[] = [];
  if (!process.env.EMAIL_FROM) missing.push("EMAIL_FROM");
  if (emailDeliveryMode() === "live") {
    if (!process.env.RESEND_API_KEY) missing.push("RESEND_API_KEY");
    if (!process.env.RESEND_API_URL) missing.push("RESEND_API_URL");
  }
  return missing;
}

function backoffMinutes(attempts: number) {
  return Math.min(60, Math.max(1, 2 ** Math.max(0, attempts - 1)));
}

function htmlFromText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\n/g, "<br>");
}

export function emailRuntimeStatus() {
  const mode = emailDeliveryMode();
  const missing = missingEmailConfig();
  return {
    enabled: mode !== "disabled" && missing.length === 0,
    mode,
    provider: emailProvider(),
    fromConfigured: Boolean(process.env.EMAIL_FROM),
    apiKeyConfigured: Boolean(process.env.RESEND_API_KEY),
    apiUrlConfigured: Boolean(process.env.RESEND_API_URL),
    missing
  };
}

async function sendWithResend(item: EmailOutboxRow) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const apiUrl = process.env.RESEND_API_URL;
  if (!apiKey || !from || !apiUrl) throw new Error(`Hiányzó e-mail konfiguráció: ${missingEmailConfig().join(", ")}`);

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [item.recipient_email],
      subject: item.subject,
      text: item.body_text,
      html: item.body_html || htmlFromText(item.body_text)
    })
  });

  const text = await response.text();
  let payload: any = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || payload?.error || text || `Resend HTTP ${response.status}`;
    throw new Error(String(message).slice(0, 2000));
  }
  return String(payload?.id ?? "");
}

export async function processEmailOutbox(limit = 20) {
  const status = emailRuntimeStatus();
  if (!status.enabled) return { ...status, processed: [] as ProcessedEmail[] };

  const queue = await query<EmailOutboxRow>(`
    with selected as (
      select id
        from public.email_outbox
       where (status='queued' or (status='processing' and processing_started_at<now()-interval '15 minutes'))
         and attempts<5
         and archived_at is null
         and (next_attempt_at is null or next_attempt_at <= now())
       order by created_at
       for update skip locked
       limit $1
    )
    update public.email_outbox q
       set attempts=q.attempts+1,
           status='processing',
           processing_started_at=now(),
           updated_at=now(),
           last_error=null
      from selected s
     where q.id=s.id
    returning q.id,q.recipient_email,q.subject,q.body_text,q.body_html,q.attempts
  `, [limit]);

  const processed: ProcessedEmail[] = [];
  for (const item of queue) {
    try {
      const providerMessageId = status.mode === "dry_run"
        ? `dry-run-${item.id}-${Date.now()}`
        : await sendWithResend(item);

      await query(`
        update public.email_outbox
           set status='sent',
               sent_at=now(),
               processing_started_at=null,
               next_attempt_at=null,
               updated_at=now(),
               provider=$2,
               provider_message_id=nullif($3,''),
               last_error=null
         where id=$1
      `, [item.id, status.provider, providerMessageId]);
      processed.push({ id: item.id, status: "sent", recipient: item.recipient_email, providerMessageId });
    } catch (error) {
      const message = error instanceof Error ? error.message.slice(0, 2000) : "Ismeretlen e-mail hiba";
      const failedPermanently = Number(item.attempts ?? 0) >= 5;
      await query(`
        update public.email_outbox
           set status=case when $3::boolean then 'failed' else 'queued' end,
               processing_started_at=null,
               next_attempt_at=case when $3::boolean then null else now()+($4::text || ' minutes')::interval end,
               updated_at=now(),
               provider=$5,
               last_error=$2
         where id=$1
      `, [item.id, message, failedPermanently, backoffMinutes(Number(item.attempts ?? 1)), status.provider]);
      processed.push({ id: item.id, status: "failed", recipient: item.recipient_email, error: message });
    }
  }

  return { ...status, processed };
}
