import { one } from "@/lib/db";

export async function supportTablesReady() {
  const result = await one<{ ready: boolean }>(`
    select to_regclass('public.support_tickets') is not null
       and to_regclass('public.support_ticket_messages') is not null as ready
  `);
  return Boolean(result?.ready);
}
