import { NextResponse } from "next/server";
import { one } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const database = await one<{
      now: string;
      migration_008: boolean;
      migration_013: boolean;
      migration_014: boolean;
      migration_016: boolean;
      inventory_cartons_table: boolean;
      inventory_carton_events_table: boolean;
      billing_documents_table: boolean;
      allocation_carton_id_column: boolean;
    }>(`
      select now()::text as now,
             exists(select 1 from public.gellamille_schema_migrations where version='008') as migration_008,
             exists(select 1 from public.gellamille_schema_migrations where version='013') as migration_013,
             exists(select 1 from public.gellamille_schema_migrations where version='014') as migration_014,
             exists(select 1 from public.gellamille_schema_migrations where version='016') as migration_016,
             to_regclass('public.inventory_cartons') is not null as inventory_cartons_table,
             to_regclass('public.inventory_carton_events') is not null as inventory_carton_events_table,
             to_regclass('public.billing_documents') is not null as billing_documents_table,
             exists(
               select 1
                 from information_schema.columns
                where table_schema='public'
                  and table_name='order_item_lot_allocations'
                  and column_name='carton_id'
             ) as allocation_carton_id_column
    `);
    return NextResponse.json({ status: "ok", service: "gellamille-app-v7", database });
  } catch (error) {
    return NextResponse.json({ status: "error", error: error instanceof Error ? error.message : "Adatbázishiba" }, { status: 500 });
  }
}
