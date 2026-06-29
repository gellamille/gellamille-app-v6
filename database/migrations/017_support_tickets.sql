-- GELLAMILLE V7.1 - SUPPORT TICKETS
-- Partner-visible support tickets with internal replies.

begin;

set local lock_timeout = '10s';
set local statement_timeout = '180s';
select pg_advisory_xact_lock(hashtext('gellamille:v7.1:migration:017'));

create table if not exists public.support_tickets (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  partner_id bigint not null references public.partners(id),
  task_id bigint references public.tasks(id),
  order_id bigint references public.orders(id),
  order_number text,
  subject text not null,
  priority text not null default 'normal' check(priority in ('normal','high','urgent')),
  status text not null default 'open' check(status in ('open','in_progress','waiting_partner','closed','cancelled')),
  assigned_to uuid references auth.users(id),
  created_by uuid references auth.users(id),
  last_message_at timestamptz not null default now(),
  closed_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_ticket_messages (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  ticket_id bigint not null references public.support_tickets(id) on delete cascade,
  sender_user_id uuid references auth.users(id),
  sender_role text not null check(sender_role in ('partner','internal','system')),
  body text not null,
  internal_only boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists support_tickets_partner_idx
  on public.support_tickets(partner_id, archived_at, status, last_message_at desc);
create index if not exists support_tickets_org_status_idx
  on public.support_tickets(organization_id, archived_at, status, last_message_at desc);
create index if not exists support_ticket_messages_ticket_idx
  on public.support_ticket_messages(ticket_id, created_at);

create or replace function public.touch_support_ticket()
returns trigger language plpgsql set search_path=public,pg_temp as $$
begin
  new.updated_at:=now();
  return new;
end $$;

drop trigger if exists trg_support_tickets_updated on public.support_tickets;
create trigger trg_support_tickets_updated before update on public.support_tickets
for each row execute function public.touch_support_ticket();

create or replace function public.sync_support_ticket_last_message()
returns trigger language plpgsql set search_path=public,pg_temp as $$
begin
  update public.support_tickets
     set last_message_at=new.created_at,
         status=case
           when status='closed' then status
           when new.sender_role='partner' then 'open'
           when new.sender_role='internal' then 'waiting_partner'
           else status
         end
   where id=new.ticket_id;
  return new;
end $$;

drop trigger if exists trg_support_ticket_message_insert on public.support_ticket_messages;
create trigger trg_support_ticket_message_insert after insert on public.support_ticket_messages
for each row execute function public.sync_support_ticket_last_message();

do $$
declare t text;
begin
 foreach t in array array['support_tickets','support_ticket_messages'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on table public.%I from anon, authenticated',t);
 end loop;
end $$;

insert into public.gellamille_schema_migrations(version,description,checksum,applied_at,applied_by)
values(
 '017',
 'Partner support tickets and conversation messages',
 encode(digest('gellamille-v7.1-017-support-tickets-2026-06-29','sha256'),'hex'),
 now(),current_user
)
on conflict(version) do update set
 description=excluded.description,checksum=excluded.checksum,applied_at=excluded.applied_at,applied_by=excluded.applied_by;

insert into public.audit_log(action,entity_type,entity_id,after_data)
values('system.migration.applied','schema_migration','017',
 jsonb_build_object('description','Support tickets','applied_at',now(),'applied_by',current_user));

commit;
