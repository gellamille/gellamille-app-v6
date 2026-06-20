import { query } from "@/lib/db";

export async function processEmailOutbox(limit = 20) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return { enabled: false, processed: [] as Array<{ id: number; status: string }> };

  const queue = await query<any>(`
    with selected as (
      select id from public.email_outbox
       where (status='queued' or (status='processing' and processing_started_at<now()-interval '15 minutes')) and attempts<5
       order by created_at
       for update skip locked
       limit $1
    )
    update public.email_outbox q
       set attempts=q.attempts+1,status='processing',processing_started_at=now(),updated_at=now()
      from selected s
     where q.id=s.id
    returning q.*
  `, [limit]);

  const processed: Array<{ id: number; status: string }> = [];
  for (const item of queue) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [item.recipient_email], subject: item.subject, text: item.body_text })
      });
      if (!response.ok) throw new Error(await response.text());
      await query(`update public.email_outbox set status='sent',sent_at=now(),processing_started_at=null,updated_at=now(),last_error=null where id=$1`, [item.id]);
      processed.push({ id: item.id, status: "sent" });
    } catch (error) {
      const message = error instanceof Error ? error.message.slice(0, 2000) : "Ismeretlen e-mail hiba";
      await query(`update public.email_outbox set status=case when attempts>=5 then 'failed' else 'queued' end,processing_started_at=null,updated_at=now(),last_error=$2 where id=$1`, [item.id, message]);
      processed.push({ id: item.id, status: "failed" });
    }
  }
  return { enabled: true, processed };
}
