-- GELLAMILLE V7.1 - ARCHIVE INVENTORY ARTIFACTS
-- The admin data archive must also remove LOT/carton inventory artifacts from
-- operational stock views. This migration adds archive markers and makes stock
-- summaries ignore archived LOTs, reservations and allocations.

begin;

set local lock_timeout = '10s';
set local statement_timeout = '180s';
select pg_advisory_xact_lock(hashtext('gellamille:v7.1:migration:015'));

alter table public.lots add column if not exists archived_at timestamptz;
alter table public.stock_reservations add column if not exists archived_at timestamptz;
alter table public.order_item_lot_allocations add column if not exists archived_at timestamptz;
alter table public.inventory_carton_events add column if not exists archived_at timestamptz;

create index if not exists lots_org_archived_created_idx
  on public.lots(organization_id, archived_at, created_at desc);
create index if not exists stock_reservations_archived_status_idx
  on public.stock_reservations(archived_at, status);
create index if not exists order_item_lot_allocations_archived_status_idx
  on public.order_item_lot_allocations(archived_at, status);
create index if not exists inventory_carton_events_archived_idx
  on public.inventory_carton_events(organization_id, archived_at, created_at desc);

create or replace view public.v_product_stock_summary as
select p.id as product_id,p.code as product_code,p.sku,p.name as product_name,p.size_ml,p.units_per_carton,
       p.minimum_stock_units,p.sort_order,
       coalesce(sum(im.quantity_units),0)::int as physical_units,
       coalesce(sum(im.quantity_units) filter (
         where loc.type in ('warehouse','production')
           and (im.lot_id is null or (l.status='active' and l.best_before>=current_date and l.archived_at is null))
       ),0)::int as saleable_units,
       coalesce((
         select sum(sr.quantity_units)
           from public.stock_reservations sr
           join public.order_items oi on oi.id=sr.order_item_id
           join public.orders o on o.id=oi.order_id
          where sr.product_id=p.id
            and sr.status='active'
            and sr.archived_at is null
            and o.archived_at is null
       ),0)::int as reserved_units,
       greatest(
        coalesce(sum(im.quantity_units) filter (
          where loc.type in ('warehouse','production')
            and (im.lot_id is null or (l.status='active' and l.best_before>=current_date and l.archived_at is null))
        ),0)-
        coalesce((
          select sum(sr.quantity_units)
            from public.stock_reservations sr
            join public.order_items oi on oi.id=sr.order_item_id
            join public.orders o on o.id=oi.order_id
           where sr.product_id=p.id
             and sr.status='active'
             and sr.archived_at is null
             and o.archived_at is null
        ),0),0)::int as available_units
from public.products p
left join public.inventory_movements im on im.product_id=p.id and im.archived_at is null
left join public.inventory_locations loc on loc.id=im.location_id
left join public.lots l on l.id=im.lot_id and l.archived_at is null
group by p.id;

create or replace view public.v_lot_stock_summary as
select l.id as lot_id,l.lot_number,l.best_before,l.status,
       coalesce(sum(im.quantity_units),0)::int as physical_units,
       coalesce(sum(im.quantity_units) filter (where loc.type in ('warehouse','production')),0)::int as warehouse_units,
       coalesce((
         select sum(a.quantity_units)
           from public.order_item_lot_allocations a
           join public.order_items oi on oi.id=a.order_item_id
           join public.orders o on o.id=oi.order_id
          where a.lot_id=l.id
            and a.status in ('allocated','picked')
            and a.archived_at is null
            and o.archived_at is null
       ),0)::int as allocated_units,
       case when l.status='active' and l.best_before>=current_date and l.archived_at is null then
         greatest(coalesce(sum(im.quantity_units) filter (where loc.type in ('warehouse','production')),0)-
          coalesce((
            select sum(a.quantity_units)
              from public.order_item_lot_allocations a
              join public.order_items oi on oi.id=a.order_item_id
              join public.orders o on o.id=oi.order_id
             where a.lot_id=l.id
               and a.status in ('allocated','picked')
               and a.archived_at is null
               and o.archived_at is null
          ),0),0)::int
       else 0 end as available_units
from public.lots l
left join public.inventory_movements im on im.lot_id=l.id and im.archived_at is null
left join public.inventory_locations loc on loc.id=im.location_id
where l.archived_at is null
group by l.id;

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
where l.archived_at is null
group by l.id;

insert into public.gellamille_schema_migrations(version,description,checksum,applied_at,applied_by)
values(
 '015',
 'Gellamille V7.1 archive LOTs, carton events and inventory reservations',
 encode(digest('gellamille-v7.1-015-archive-inventory-artifacts-2026-06-28','sha256'),'hex'),
 now(),current_user
)
on conflict(version) do update set
 description=excluded.description,checksum=excluded.checksum,applied_at=excluded.applied_at,applied_by=excluded.applied_by;

insert into public.audit_log(action,entity_type,entity_id,after_data)
values('system.migration.applied','schema_migration','015',
 jsonb_build_object('description','Archive inventory artifacts','applied_at',now(),'applied_by',current_user));

commit;
