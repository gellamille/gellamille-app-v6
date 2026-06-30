import { NextResponse } from "next/server";
import { one } from "@/lib/db";
import { monitoringStatus } from "@/lib/monitoring";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const database = await one<{
      now: string;
      migration_008: boolean;
      migration_013: boolean;
      migration_014: boolean;
      migration_016: boolean;
      migration_017: boolean;
      migration_018: boolean;
      migration_019: boolean;
      inventory_cartons_table: boolean;
      inventory_carton_events_table: boolean;
      billing_documents_table: boolean;
      support_tickets_table: boolean;
      support_ticket_messages_table: boolean;
      rate_limit_counters_table: boolean;
      allocation_carton_id_column: boolean;
    }>(`
      select now()::text as now,
             exists(select 1 from public.gellamille_schema_migrations where version='008') as migration_008,
             exists(select 1 from public.gellamille_schema_migrations where version='013') as migration_013,
             exists(select 1 from public.gellamille_schema_migrations where version='014') as migration_014,
             exists(select 1 from public.gellamille_schema_migrations where version='016') as migration_016,
             exists(select 1 from public.gellamille_schema_migrations where version='017') as migration_017,
             exists(select 1 from public.gellamille_schema_migrations where version='018') as migration_018,
             exists(select 1 from public.gellamille_schema_migrations where version='019') as migration_019,
             to_regclass('public.inventory_cartons') is not null as inventory_cartons_table,
             to_regclass('public.inventory_carton_events') is not null as inventory_carton_events_table,
             to_regclass('public.billing_documents') is not null as billing_documents_table,
             to_regclass('public.support_tickets') is not null as support_tickets_table,
             to_regclass('public.support_ticket_messages') is not null as support_ticket_messages_table,
             to_regclass('public.rate_limit_counters') is not null as rate_limit_counters_table,
             exists(
               select 1
                 from information_schema.columns
                where table_schema='public'
                  and table_name='order_item_lot_allocations'
                  and column_name='carton_id'
             ) as allocation_carton_id_column
    `);
    return NextResponse.json({ status: "ok", service: "gellamille-app-v7", database, monitoring: monitoringStatus() });
  } catch (error) {
    return NextResponse.json({ status: "error", error: error instanceof Error ? error.message : "Adatbázishiba" }, { status: 500 });
  }
}
