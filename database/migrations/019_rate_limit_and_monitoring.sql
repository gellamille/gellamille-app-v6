begin;

set local lock_timeout = '10s';
set local statement_timeout = '180s';
select pg_advisory_xact_lock(hashtext('gellamille:v7.1:migration:019'));

create table if not exists public.rate_limit_counters (
  scope text not null,
  identifier_hash text not null,
  window_start timestamptz not null default now(),
  window_seconds integer not null check(window_seconds > 0),
  attempts integer not null default 0 check(attempts >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key(scope, identifier_hash)
);

create index if not exists rate_limit_counters_cleanup_idx
  on public.rate_limit_counters(updated_at);

alter table public.rate_limit_counters enable row level security;
revoke all on table public.rate_limit_counters from anon, authenticated;

insert into public.gellamille_schema_migrations(version,description,checksum,applied_at,applied_by)
values(
 '019',
 'Rate limiting counters and monitoring readiness',
 encode(digest('gellamille-v7.1-019-rate-limit-monitoring-2026-06-30','sha256'),'hex'),
 now(),current_user
)
on conflict(version) do update set
 description=excluded.description,checksum=excluded.checksum,applied_at=excluded.applied_at,applied_by=excluded.applied_by;

insert into public.audit_log(action,entity_type,entity_id,after_data)
values('system.migration.applied','schema_migration','019',
 jsonb_build_object('description','Rate limiting and monitoring','applied_at',now(),'applied_by',current_user));

commit;
