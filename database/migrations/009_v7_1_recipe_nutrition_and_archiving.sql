-- GELLAMILLE V7.1 - receptura tapanyagok es admin archiválás
-- Additiv migracio: nem torol adatot, csak uj mezoket/tablat ad hozza.

begin;

set local lock_timeout = '10s';
set local statement_timeout = '120s';
select pg_advisory_xact_lock(hashtext('gellamille:v7.1:migration:009'));

alter table public.recipe_versions add column if not exists nutrition_calories_kcal_per_100g numeric(10,2) not null default 0;
alter table public.recipe_versions add column if not exists nutrition_fat_g_per_100g numeric(10,3) not null default 0;
alter table public.recipe_versions add column if not exists nutrition_saturated_fat_g_per_100g numeric(10,3) not null default 0;
alter table public.recipe_versions add column if not exists nutrition_carbohydrate_g_per_100g numeric(10,3) not null default 0;
alter table public.recipe_versions add column if not exists nutrition_sugars_g_per_100g numeric(10,3) not null default 0;
alter table public.recipe_versions add column if not exists nutrition_protein_g_per_100g numeric(10,3) not null default 0;
alter table public.recipe_versions add column if not exists nutrition_salt_g_per_100g numeric(10,3) not null default 0;

alter table public.shipping_runs add column if not exists archived_at timestamptz;
alter table public.deliveries add column if not exists archived_at timestamptz;
alter table public.receivables add column if not exists archived_at timestamptz;
alter table public.payments add column if not exists archived_at timestamptz;
alter table public.financial_adjustments add column if not exists archived_at timestamptz;
alter table public.expenses add column if not exists archived_at timestamptz;
alter table public.returns add column if not exists archived_at timestamptz;
alter table public.product_recalls add column if not exists archived_at timestamptz;
alter table public.stocktakes add column if not exists archived_at timestamptz;
alter table public.email_outbox add column if not exists archived_at timestamptz;

create or replace view public.v_receivables_open as
select r.id,r.receivable_number,r.partner_id,p.name as partner_name,r.order_id,o.order_number,
       r.delivery_id,r.net_amount_huf,r.vat_amount_huf,r.gross_amount_huf,r.delivered_at,r.due_date,
       coalesce((select sum(pa.amount_huf)
                   from public.payment_allocations pa
                   join public.payments pay on pay.id=pa.payment_id
                  where pa.receivable_id=r.id and pay.archived_at is null),0)::int as paid_huf,
       (r.gross_amount_huf
        +coalesce((select sum(fa.amount_huf)
                     from public.financial_adjustments fa
                    where fa.receivable_id=r.id and fa.archived_at is null),0)
        -coalesce((select sum(pa.amount_huf)
                     from public.payment_allocations pa
                     join public.payments pay on pay.id=pa.payment_id
                    where pa.receivable_id=r.id and pay.archived_at is null),0))::int as outstanding_huf,
       case
        when r.status='void' then 'void'
        when (r.gross_amount_huf+coalesce((select sum(fa.amount_huf)
                                             from public.financial_adjustments fa
                                            where fa.receivable_id=r.id and fa.archived_at is null),0)
             -coalesce((select sum(pa.amount_huf)
                          from public.payment_allocations pa
                          join public.payments pay on pay.id=pa.payment_id
                         where pa.receivable_id=r.id and pay.archived_at is null),0))<=0 then 'paid'
        when r.due_date<current_date then 'overdue'
        when coalesce((select sum(pa.amount_huf)
                         from public.payment_allocations pa
                         join public.payments pay on pay.id=pa.payment_id
                        where pa.receivable_id=r.id and pay.archived_at is null),0)>0 then 'partially_paid'
        else 'receivable' end as status
from public.receivables r
join public.partners p on p.id=r.partner_id
join public.orders o on o.id=r.order_id
where r.status<>'void'
  and r.archived_at is null
  and o.archived_at is null;

create table if not exists public.data_archive_batches (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  period_type text not null check(period_type in ('day','week','month','quarter')),
  from_date date not null,
  to_date date not null,
  reason text not null,
  table_counts jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  check(to_date > from_date)
);

alter table public.data_archive_batches enable row level security;
revoke all on table public.data_archive_batches from anon, authenticated;

insert into public.gellamille_schema_migrations(version,description,checksum,applied_at,applied_by)
values(
 '009',
 'Gellamille V7.1 recipe nutrition fields and admin archive batches',
 encode(digest('gellamille-v7.1-009-recipe-nutrition-and-archiving-2026-06-22','sha256'),'hex'),
 now(),current_user
)
on conflict(version) do update set
 description=excluded.description,checksum=excluded.checksum,applied_at=excluded.applied_at,applied_by=excluded.applied_by;

insert into public.audit_log(action,entity_type,entity_id,after_data)
values('system.migration.applied','schema_migration','009',
 jsonb_build_object('description','Gellamille V7.1 recipe nutrition and archiving','applied_at',now(),'applied_by',current_user));

commit;
