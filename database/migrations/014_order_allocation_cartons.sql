-- GELLAMILLE V7.1 - RENDELESI OSSZEKESZITES FIZIKAI KARTONNAL

begin;

set local lock_timeout = '10s';
set local statement_timeout = '180s';
select pg_advisory_xact_lock(hashtext('gellamille:v7.1:migration:014'));

alter table public.order_item_lot_allocations
  add column if not exists carton_id bigint references public.inventory_cartons(id);

create index if not exists order_item_lot_allocations_carton_idx
  on public.order_item_lot_allocations(carton_id)
  where carton_id is not null;

create unique index if not exists order_item_lot_allocations_one_active_carton_idx
  on public.order_item_lot_allocations(carton_id)
  where carton_id is not null and status in ('allocated','picked');

insert into public.gellamille_schema_migrations(version,description,checksum,applied_at,applied_by)
values(
 '014',
 'Gellamille V7.1 order picking can bind LOT allocations to physical cartons',
 encode(digest('gellamille-v7.1-014-order-allocation-cartons-2026-06-28','sha256'),'hex'),
 now(),current_user
)
on conflict(version) do update set
 description=excluded.description,checksum=excluded.checksum,applied_at=excluded.applied_at,applied_by=excluded.applied_by;

insert into public.audit_log(action,entity_type,entity_id,after_data)
values('system.migration.applied','schema_migration','014',
 jsonb_build_object('description','Gellamille V7.1 order allocation cartons','applied_at',now(),'applied_by',current_user));

commit;
