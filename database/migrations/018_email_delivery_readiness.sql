-- E-mail outbox élesítés előkészítése: HTML tartalom, provider nyomkövetés,
-- retry ütemezés és gyors queue lekérdezés.

begin;

set local lock_timeout = '10s';
set local statement_timeout = '180s';
select pg_advisory_xact_lock(hashtext('gellamille:v7.1:migration:018'));

alter table public.email_outbox add column if not exists body_html text;
alter table public.email_outbox add column if not exists provider text not null default 'resend';
alter table public.email_outbox add column if not exists provider_message_id text;
alter table public.email_outbox add column if not exists next_attempt_at timestamptz;

create index if not exists email_outbox_queue_idx
  on public.email_outbox(status,next_attempt_at,created_at)
  where archived_at is null and status in ('queued','processing');

create index if not exists email_outbox_org_status_idx
  on public.email_outbox(organization_id,status,created_at desc)
  where archived_at is null;

insert into public.gellamille_schema_migrations(version,description,checksum,applied_at,applied_by)
values(
 '018',
 'Email delivery readiness and provider tracking',
 encode(digest('gellamille-v7.1-018-email-delivery-readiness-2026-06-30','sha256'),'hex'),
 now(),current_user
)
on conflict(version) do update set
 description=excluded.description,checksum=excluded.checksum,applied_at=excluded.applied_at,applied_by=excluded.applied_by;

insert into public.audit_log(action,entity_type,entity_id,after_data)
values('system.migration.applied','schema_migration','018',
 jsonb_build_object('description','Email delivery readiness','applied_at',now(),'applied_by',current_user));

commit;
