-- GELLAMILLE V7.1 - FIZIKAI KARTON NYOMONKOVETES
-- Additiv migracio: a LOT es inventory_movements tovabbra is a keszlet
-- penzugyi/mennyisegi alapja, a karton tabla a fizikai raktari kovetes retege.

begin;

set local lock_timeout = '10s';
set local statement_timeout = '180s';
select pg_advisory_xact_lock(hashtext('gellamille:v7.1:migration:013'));

create sequence if not exists public.inventory_carton_sequence;

create table if not exists public.inventory_cartons (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  product_id bigint not null references public.products(id),
  lot_id bigint not null references public.lots(id),
  location_id bigint references public.inventory_locations(id),
  carton_sequence bigint not null default nextval('public.inventory_carton_sequence'),
  carton_code text not null,
  quantity_units integer not null check(quantity_units > 0),
  status text not null default 'in_stock' check(status in (
    'created','in_stock','reserved','picked','delivered','returned','recalled','scrapped','archived'
  )),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  unique(organization_id, carton_code),
  unique(carton_sequence)
);

create index if not exists inventory_cartons_org_status_idx
  on public.inventory_cartons(organization_id,status,created_at desc);
create index if not exists inventory_cartons_lot_idx
  on public.inventory_cartons(lot_id,status);
create index if not exists inventory_cartons_product_location_idx
  on public.inventory_cartons(product_id,location_id,status);

create or replace function public.set_inventory_carton_code()
returns trigger
language plpgsql
set search_path=public,pg_temp
as $$
begin
  if new.carton_sequence is null then
    new.carton_sequence := nextval('public.inventory_carton_sequence');
  end if;

  if new.carton_code is null or length(trim(new.carton_code)) = 0 then
    new.carton_code := 'GM-C-' || to_char(now(), 'YYYY') || '-' || lpad(new.carton_sequence::text, 6, '0');
  end if;

  return new;
end $$;
revoke all on function public.set_inventory_carton_code() from public,anon,authenticated;

drop trigger if exists trg_inventory_carton_code on public.inventory_cartons;
create trigger trg_inventory_carton_code
before insert on public.inventory_cartons
for each row execute function public.set_inventory_carton_code();

drop trigger if exists trg_inventory_cartons_updated on public.inventory_cartons;
create trigger trg_inventory_cartons_updated
before update on public.inventory_cartons
for each row execute function public.touch_updated_at();

create table if not exists public.inventory_carton_events (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  carton_id bigint not null references public.inventory_cartons(id) on delete cascade,
  event_type text not null check(event_type in (
    'created','received','moved','reserved','picked','unpicked','delivered',
    'returned','scrapped','recalled','archived','label_printed','label_reprinted','checked'
  )),
  from_location_id bigint references public.inventory_locations(id),
  to_location_id bigint references public.inventory_locations(id),
  order_id bigint references public.orders(id),
  order_item_id bigint references public.order_items(id),
  actor_user_id uuid references auth.users(id),
  note text,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists inventory_carton_events_carton_idx
  on public.inventory_carton_events(carton_id,created_at desc);
create index if not exists inventory_carton_events_org_type_idx
  on public.inventory_carton_events(organization_id,event_type,created_at desc);

create or replace view public.v_lot_carton_summary
with (security_invoker = true)
as
select
  l.id as lot_id,
  count(c.id)::int as carton_count,
  coalesce(sum(c.quantity_units),0)::int as carton_units,
  count(c.id) filter (where c.status in ('created','in_stock'))::int as available_carton_count,
  coalesce(sum(c.quantity_units) filter (where c.status in ('created','in_stock')),0)::int as available_carton_units,
  count(c.id) filter (where c.status in ('reserved','picked'))::int as allocated_carton_count,
  coalesce(sum(c.quantity_units) filter (where c.status in ('reserved','picked')),0)::int as allocated_carton_units,
  count(c.id) filter (where c.status in ('delivered'))::int as delivered_carton_count,
  count(c.id) filter (where c.status in ('recalled','scrapped'))::int as blocked_carton_count
from public.lots l
left join public.inventory_cartons c on c.lot_id = l.id and c.archived_at is null
group by l.id;

alter table public.inventory_cartons enable row level security;
alter table public.inventory_carton_events enable row level security;
revoke all on table public.inventory_cartons from anon, authenticated;
revoke all on table public.inventory_carton_events from anon, authenticated;
revoke all on public.v_lot_carton_summary from anon, authenticated;

insert into public.gellamille_schema_migrations(version,description,checksum,applied_at,applied_by)
values(
 '013',
 'Gellamille V7.1 physical carton tracking and carton event log',
 encode(digest('gellamille-v7.1-013-inventory-carton-tracking-2026-06-28','sha256'),'hex'),
 now(),current_user
)
on conflict(version) do update set
 description=excluded.description,checksum=excluded.checksum,applied_at=excluded.applied_at,applied_by=excluded.applied_by;

insert into public.audit_log(action,entity_type,entity_id,after_data)
values('system.migration.applied','schema_migration','013',
 jsonb_build_object('description','Gellamille V7.1 physical carton tracking','applied_at',now(),'applied_by',current_user));

commit;
