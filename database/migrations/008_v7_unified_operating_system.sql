-- GELLAMILLE V7 – EGYSÉGES MŰKÖDÉSI RENDSZER
-- Előfeltétel: a 006 V6 migráció sikeresen lefutott.
-- Ez a migráció additív, a meglévő LOT- és rendelési adatokat nem törli.
-- Futtatás: Supabase SQL Editorban egyben.

begin;

set local lock_timeout = '10s';
set local statement_timeout = '180s';
select pg_advisory_xact_lock(hashtext('gellamille:v7:migration:008'));

do $$
begin
  if to_regclass('public.gellamille_schema_migrations') is null
     or not exists (select 1 from public.gellamille_schema_migrations where version='006') then
    raise exception 'A V6 006 migráció nem található. Előbb azt kell futtatni.';
  end if;
end $$;

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. SZERVEZET ÉS JOGOSULTSÁGOK
-- ---------------------------------------------------------------------------

create table if not exists public.organizations (
  id bigint generated always as identity primary key,
  name text not null unique,
  legal_name text,
  tax_number text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.organizations(name, legal_name)
values ('Gellamille', 'Gellamille Kft.')
on conflict (name) do nothing;

alter table public.app_users add column if not exists organization_id bigint references public.organizations(id);
update public.app_users set organization_id=(select id from public.organizations where name='Gellamille')
where organization_id is null;

alter table public.app_users drop constraint if exists app_users_role_check;
alter table public.app_users add constraint app_users_role_check check (
  role in ('admin','management','staff','production','warehouse','finance','sales','partner')
);
alter table public.app_users drop constraint if exists app_users_partner_role;
alter table public.app_users add constraint app_users_partner_role check (
  (role='partner' and partner_id is not null)
  or
  (role in ('admin','management','staff','production','warehouse','finance','sales') and partner_id is null)
);
alter table public.app_users alter column organization_id set not null;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
begin
  insert into public.app_users(user_id,email,display_name,role,partner_id,active,organization_id)
  values(
    new.id,new.email,split_part(coalesce(new.email,'Felhasználó'),'@',1),
    'staff',null,false,(select id from public.organizations where name='Gellamille')
  )
  on conflict(user_id) do update set email=excluded.email;
  return new;
end $$;
revoke all on function public.handle_new_auth_user() from public,anon,authenticated;

create unique index if not exists app_users_one_login_per_partner_idx
  on public.app_users(partner_id)
  where partner_id is not null and role='partner';

create table if not exists public.roles (
  code text primary key,
  name text not null,
  internal boolean not null default true
);

create table if not exists public.permissions (
  code text primary key,
  name text not null
);

create table if not exists public.role_permissions (
  role_code text not null references public.roles(code) on delete cascade,
  permission_code text not null references public.permissions(code) on delete cascade,
  primary key(role_code,permission_code)
);

insert into public.roles(code,name,internal) values
('admin','Adminisztrátor',true),
('management','Vezetőség',true),
('staff','Belső munkatárs',true),
('production','Gyártási dolgozó',true),
('warehouse','Raktári dolgozó',true),
('finance','Pénzügy',true),
('sales','Értékesítés',true),
('partner','Partner',false)
on conflict(code) do update set name=excluded.name, internal=excluded.internal;

insert into public.permissions(code,name) values
('dashboard.read','Vezérlőpult megtekintése'),
('orders.read','Rendelések megtekintése'),
('orders.write','Rendelések kezelése'),
('production.read','Gyártás megtekintése'),
('production.write','LOT létrehozása és korrekció'),
('inventory.read','Készlet megtekintése'),
('inventory.write','Készlet kezelése'),
('shipments.read','Szállítás megtekintése'),
('shipments.write','Szállítás kezelése'),
('finance.read','Pénzügy megtekintése'),
('finance.write','Pénzügy kezelése'),
('partners.read','Partnerek megtekintése'),
('partners.write','Partnerek kezelése'),
('tasks.read','Feladatok megtekintése'),
('tasks.write','Feladatok kezelése'),
('materials.read','Alapanyagok megtekintése'),
('materials.write','Alapanyagok kezelése'),
('analytics.read','Elemzések megtekintése'),
('settings.write','Beállítások kezelése'),
('partner.order','Partneri rendelés leadása')
on conflict(code) do update set name=excluded.name;

insert into public.role_permissions(role_code,permission_code)
select 'admin',code from public.permissions
on conflict do nothing;

insert into public.role_permissions(role_code,permission_code)
select 'management',code from public.permissions where code <> 'settings.write'
on conflict do nothing;

insert into public.role_permissions(role_code,permission_code) values
('production','dashboard.read'),('production','production.read'),('production','production.write'),
('production','inventory.read'),('production','materials.read'),
('warehouse','dashboard.read'),('warehouse','orders.read'),('warehouse','inventory.read'),
('warehouse','inventory.write'),('warehouse','shipments.read'),('warehouse','shipments.write'),
('finance','dashboard.read'),('finance','finance.read'),('finance','finance.write'),
('finance','orders.read'),('finance','partners.read'),
('sales','dashboard.read'),('sales','orders.read'),('sales','orders.write'),
('sales','partners.read'),('sales','partners.write'),('sales','tasks.read'),('sales','tasks.write'),
('sales','analytics.read'),
('staff','dashboard.read'),('staff','orders.read'),('staff','production.read'),
('staff','inventory.read'),('staff','shipments.read'),('staff','partners.read'),('staff','tasks.read'),
('partner','partner.order')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- 2. MEGLÉVŐ TÁBLÁK KIBŐVÍTÉSE
-- ---------------------------------------------------------------------------

do $$
declare v_org bigint;
begin
  select id into v_org from public.organizations where name='Gellamille';

  alter table public.products add column if not exists organization_id bigint references public.organizations(id);
  alter table public.products add column if not exists sku text;
  alter table public.products add column if not exists name text;
  alter table public.products add column if not exists status text not null default 'active';
  alter table public.products add column if not exists purchase_unit_price_huf integer not null default 0;
  alter table public.products add column if not exists minimum_stock_units integer not null default 0;
  alter table public.products add column if not exists archived_at timestamptz;

  update public.products p
     set organization_id=coalesce(p.organization_id,v_org),
         sku=coalesce(p.sku,'GM-'||p.flavor_code||'-'||p.size_ml::text),
         name=coalesce(p.name,(select f.name from public.flavors f where f.code=p.flavor_code)||' dobozos fagylalt – '||p.size_ml||' ml');

  alter table public.partners add column if not exists organization_id bigint references public.organizations(id);
  alter table public.partners add column if not exists active boolean not null default true;
  alter table public.partners add column if not exists default_payment_method text not null default 'bank_transfer';
  alter table public.partners add column if not exists payment_terms_days integer not null default 8;
  alter table public.partners add column if not exists minimum_order_cartons integer not null default 5;
  alter table public.partners add column if not exists credit_limit_huf bigint;
  alter table public.partners add column if not exists overdue_policy text not null default 'warn';
  alter table public.partners add column if not exists price_list_id bigint;
  alter table public.partners add column if not exists archived_at timestamptz;
  update public.partners set organization_id=coalesce(organization_id,v_org);

  alter table public.lots add column if not exists organization_id bigint references public.organizations(id);
  alter table public.lots add column if not exists purchase_unit_price_huf integer not null default 0;
  alter table public.lots add column if not exists recalled_at timestamptz;
  alter table public.lots add column if not exists recall_reason text;
  update public.lots set organization_id=coalesce(organization_id,v_org);

  alter table public.orders add column if not exists organization_id bigint references public.organizations(id);
  alter table public.orders add column if not exists fulfillment_status text not null default 'unreserved';
  alter table public.orders add column if not exists finance_status text not null default 'not_due';
  alter table public.orders add column if not exists delivery_address_id bigint;
  alter table public.orders add column if not exists accepted_with_shortage boolean not null default false;
  alter table public.orders add column if not exists archived_at timestamptz;
  update public.orders set organization_id=coalesce(organization_id,v_org);

  alter table public.order_items add column if not exists reserved_quantity integer not null default 0;
  alter table public.order_items add column if not exists fulfilled_quantity integer not null default 0;
  alter table public.order_items add column if not exists cancelled_quantity integer not null default 0;
  alter table public.order_items add column if not exists purchase_unit_price_huf_snapshot integer not null default 0;
  update public.order_items set reserved_quantity=least(reserved_quantity,unit_quantity);

  alter table public.shipments add column if not exists organization_id bigint references public.organizations(id);
  update public.shipments set organization_id=coalesce(organization_id,v_org);
end $$;

-- A LOT életciklusa nem csak aktív/sztornózott lehet. A V6 szigorú
-- konzisztencia-ellenőrzését úgy bővítjük, hogy lejárat, karantén,
-- selejt és visszahívás is biztonságosan kezelhető legyen.
alter table public.lots drop constraint if exists lots_status_check;
alter table public.lots drop constraint if exists lots_void_consistency_v6;
alter table public.lots drop constraint if exists lots_status_v7_check;
alter table public.lots add constraint lots_status_v7_check check (
  status in ('active','void','expired','recalled','quarantine','depleted','scrapped')
);
alter table public.lots drop constraint if exists lots_lifecycle_consistency_v7;
alter table public.lots add constraint lots_lifecycle_consistency_v7 check (
  (status='void' and void_reason is not null and length(trim(void_reason))>=5
    and voided_at is not null and voided_by is not null)
  or
  (status<>'void' and void_reason is null and voided_at is null and voided_by is null)
);

alter table public.products drop constraint if exists products_status_v7_check;
alter table public.products add constraint products_status_v7_check check (
  status in ('active','temporarily_unavailable','seasonal','phasing_out','discontinued')
);
alter table public.products drop constraint if exists products_min_stock_nonnegative;
alter table public.products add constraint products_min_stock_nonnegative check(minimum_stock_units>=0);
create unique index if not exists products_sku_unique_idx on public.products(sku);

alter table public.partners drop constraint if exists partners_default_payment_method_v7;
alter table public.partners add constraint partners_default_payment_method_v7 check(
 default_payment_method in ('cash_on_delivery','card_on_delivery','bank_transfer')
);
alter table public.partners drop constraint if exists partners_terms_v7;
alter table public.partners add constraint partners_terms_v7 check(payment_terms_days between 0 and 365);
alter table public.partners drop constraint if exists partners_overdue_policy_v7;
alter table public.partners add constraint partners_overdue_policy_v7 check(overdue_policy in ('warn','block'));

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders drop constraint if exists orders_status_v7_check;
alter table public.orders add constraint orders_status_v7_check check(
 status in ('draft','submitted','approved','partially_approved','stock_shortage','rejected','cancelled','closed','void')
);
alter table public.orders drop constraint if exists orders_fulfillment_status_v7_check;
alter table public.orders add constraint orders_fulfillment_status_v7_check check(
 fulfillment_status in ('unreserved','partially_reserved','reserved','picking','packed','partially_delivered','delivered','cancelled')
);
alter table public.orders drop constraint if exists orders_finance_status_v7_check;
alter table public.orders add constraint orders_finance_status_v7_check check(
 finance_status in ('not_due','receivable','partially_paid','paid','overdue','void')
);

alter table public.order_items drop constraint if exists order_items_quantities_v7;
alter table public.order_items add constraint order_items_quantities_v7 check(
 reserved_quantity>=0 and fulfilled_quantity>=0 and cancelled_quantity>=0
 and reserved_quantity+fulfilled_quantity+cancelled_quantity<=unit_quantity
);

-- Új rendelési számozás: GM-ORD-YYYY-######
alter table public.orders drop constraint if exists orders_order_sequence_check;
alter table public.orders drop constraint if exists orders_number_consistency_v6;
alter table public.orders drop constraint if exists orders_number_consistency_v7;
alter table public.orders drop constraint if exists orders_order_sequence_v7;
alter table public.orders add constraint orders_order_sequence_v7 check(order_sequence between 1 and 999999);

with ranked as (
  select id, extract(year from requested_delivery_date)::int as y,
         row_number() over(partition by extract(year from requested_delivery_date) order by created_at,id)::int as seq
  from public.orders
)
update public.orders o set
  order_year=r.y,
  order_sequence=r.seq,
  order_number='GM-ORD-'||r.y||'-'||lpad(r.seq::text,6,'0')
from ranked r where r.id=o.id;

alter table public.orders add constraint orders_number_consistency_v7 check(
 order_year=extract(year from requested_delivery_date)::int
 and order_number='GM-ORD-'||order_year||'-'||lpad(order_sequence::text,6,'0')
);

create or replace function public.set_gellamille_order_number()
returns trigger language plpgsql set search_path=pg_catalog,public as $$
declare v_year int;
begin
  v_year:=extract(year from new.requested_delivery_date)::int;
  new.order_year:=v_year;
  if new.order_sequence is null or new.order_sequence<=0 then
    perform pg_advisory_xact_lock(hashtext('gellamille:order:'||v_year));
    select coalesce(max(order_sequence),0)+1 into new.order_sequence
      from public.orders where order_year=v_year;
  end if;
  if new.order_sequence>999999 then raise exception 'Az éves rendelési sorszám betelt.'; end if;
  new.order_number:='GM-ORD-'||v_year||'-'||lpad(new.order_sequence::text,6,'0');
  return new;
end $$;

-- A LOT gyártott mennyisége és azonosítóadatai létrehozás után nem írhatók át.
-- Készlethibát kizárólag indokolt inventory_movements korrekció rendezhet.
create or replace function public.enforce_lot_update()
returns trigger language plpgsql set search_path=pg_catalog,public as $$
begin
  if new.production_date is distinct from old.production_date
     or new.production_period is distinct from old.production_period
     or new.flavor_code is distinct from old.flavor_code
     or new.size_ml is distinct from old.size_ml
     or new.batch_no is distinct from old.batch_no
     or new.lot_number is distinct from old.lot_number
     or new.best_before is distinct from old.best_before
     or new.quantity is distinct from old.quantity then
    raise exception 'A létrehozott LOT azonosító-, lejárati és gyártott mennyiségi adatai nem módosíthatók. Használj indokolt készletkorrekciót vagy sztornózást.';
  end if;

  if old.status in ('void','expired','recalled','scrapped') and new.status is distinct from old.status then
    raise exception 'A % állapotú LOT nem aktiválható újra.',old.status;
  end if;
  if old.status='depleted' and new.status is distinct from old.status then
    raise exception 'Az elfogyott LOT állapota közvetlenül nem módosítható.';
  end if;
  if old.status='quarantine' and new.status not in ('quarantine','active','scrapped','void') then
    raise exception 'Érvénytelen karantén LOT állapotváltás.';
  end if;

  if new.status='void' then
    if new.void_reason is null or length(trim(new.void_reason))<5
       or new.voided_at is null or new.voided_by is null then
      raise exception 'A LOT sztornózásához indok, időpont és felhasználó szükséges.';
    end if;
  elsif new.void_reason is not null or new.voided_at is not null or new.voided_by is not null then
    raise exception 'Nem sztornózott LOT nem tartalmazhat sztornózási adatot.';
  end if;
  return new;
end $$;
revoke all on function public.enforce_lot_update() from public,anon,authenticated;

-- ---------------------------------------------------------------------------
-- 3. PARTNERADATOK ÉS ÁRLISTÁK
-- ---------------------------------------------------------------------------

create table if not exists public.partner_addresses (
  id bigint generated always as identity primary key,
  partner_id bigint not null references public.partners(id) on delete cascade,
  name text not null,
  postal_code text not null,
  city text not null,
  address_line1 text not null,
  address_line2 text,
  is_default boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders drop constraint if exists orders_delivery_address_fk;
alter table public.orders add constraint orders_delivery_address_fk foreign key(delivery_address_id) references public.partner_addresses(id);

create table if not exists public.partner_contacts (
  id bigint generated always as identity primary key,
  partner_id bigint not null references public.partners(id) on delete cascade,
  name text not null,
  role_type text not null default 'general',
  email text,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.price_lists (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  name text not null,
  type text not null default 'general' check(type in ('general','partner')),
  partner_id bigint references public.partners(id),
  valid_from date not null,
  valid_to date,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table if not exists public.price_list_items (
  id bigint generated always as identity primary key,
  price_list_id bigint not null references public.price_lists(id) on delete cascade,
  product_id bigint not null references public.products(id),
  net_unit_price_huf integer not null check(net_unit_price_huf>0),
  vat_rate_bps integer not null default 2700 check(vat_rate_bps between 0 and 10000),
  unique(price_list_id,product_id)
);

alter table public.partners drop constraint if exists partners_price_list_fk;
alter table public.partners add constraint partners_price_list_fk foreign key(price_list_id) references public.price_lists(id);

create table if not exists public.order_adjustments (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  type text not null check(type in ('delivery_fee','discount_fixed','discount_percent','credit','promotion','surcharge')),
  description text not null,
  net_amount_huf integer not null,
  vat_rate_bps integer not null default 2700,
  gross_amount_huf integer not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

-- ---------------------------------------------------------------------------
-- 4. KÉSZLET, FOGLALÁS, FEFO
-- ---------------------------------------------------------------------------

create table if not exists public.inventory_locations (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  code text not null,
  name text not null,
  type text not null check(type in ('production','warehouse','vehicle','partner_consignment','quarantine','scrap')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(organization_id,code)
);

insert into public.inventory_locations(organization_id,code,name,type)
select id,'CENTRAL','Központi raktár','warehouse' from public.organizations where name='Gellamille'
on conflict(organization_id,code) do nothing;
insert into public.inventory_locations(organization_id,code,name,type)
select id,'QUARANTINE','Karantén','quarantine' from public.organizations where name='Gellamille'
on conflict(organization_id,code) do nothing;
insert into public.inventory_locations(organization_id,code,name,type)
select id,'SCRAP','Selejt','scrap' from public.organizations where name='Gellamille'
on conflict(organization_id,code) do nothing;

create table if not exists public.inventory_movements (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  product_id bigint not null references public.products(id),
  lot_id bigint references public.lots(id),
  location_id bigint not null references public.inventory_locations(id),
  movement_type text not null check(movement_type in (
    'opening_balance','production_receipt','correction','reservation_release',
    'delivery_issue','return_to_quarantine','return_to_stock','scrap','expiry',
    'recall','sample','marketing','tasting','internal_use','damage','transfer_in','transfer_out','stocktake'
  )),
  quantity_units integer not null check(quantity_units<>0),
  unit_cost_huf integer not null default 0 check(unit_cost_huf>=0),
  reason text,
  order_id bigint references public.orders(id),
  delivery_id bigint,
  return_id bigint,
  stocktake_id bigint,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  reversed_movement_id bigint references public.inventory_movements(id),
  archived_at timestamptz
);
create index if not exists inventory_movements_product_location_idx on public.inventory_movements(product_id,location_id,created_at);
create index if not exists inventory_movements_lot_idx on public.inventory_movements(lot_id,created_at);

create table if not exists public.stock_reservations (
  id bigint generated always as identity primary key,
  order_item_id bigint not null references public.order_items(id) on delete cascade,
  product_id bigint not null references public.products(id),
  location_id bigint not null references public.inventory_locations(id),
  quantity_units integer not null check(quantity_units>0),
  status text not null default 'active' check(status in ('active','released','fulfilled','cancelled')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  released_at timestamptz
);
alter table public.stock_reservations drop constraint if exists stock_reservations_order_item_id_location_id_status_key;
create unique index if not exists stock_reservations_one_active_idx
  on public.stock_reservations(order_item_id,location_id) where status='active';

create table if not exists public.order_item_lot_allocations (
  id bigint generated always as identity primary key,
  order_item_id bigint not null references public.order_items(id) on delete cascade,
  lot_id bigint not null references public.lots(id),
  location_id bigint not null references public.inventory_locations(id),
  quantity_units integer not null check(quantity_units>0),
  status text not null default 'allocated' check(status in ('allocated','picked','delivered','released','cancelled')),
  override_reason text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  delivered_at timestamptz
);
create index if not exists order_item_lot_allocations_item_idx on public.order_item_lot_allocations(order_item_id,status);
create index if not exists order_item_lot_allocations_lot_idx on public.order_item_lot_allocations(lot_id,status);

-- Meglévő készlet nyitó egyenlege a V6 lot_stock nézet alapján.
insert into public.inventory_movements(
 organization_id,product_id,lot_id,location_id,movement_type,quantity_units,unit_cost_huf,reason
)
select l.organization_id,p.id,l.id,loc.id,'opening_balance',ls.available_quantity,
       l.purchase_unit_price_huf,'V7 nyitó készlet a V6 lot_stock alapján'
from public.lot_stock ls
join public.lots l on l.id=ls.lot_id
join public.products p on p.flavor_code=l.flavor_code and p.size_ml=l.size_ml
join public.inventory_locations loc on loc.organization_id=l.organization_id and loc.code='CENTRAL'
where ls.available_quantity>0
and not exists(select 1 from public.inventory_movements im where im.lot_id=l.id);

create or replace view public.v_product_stock_summary as
select p.id as product_id,p.code as product_code,p.sku,p.name as product_name,p.size_ml,p.units_per_carton,
       p.minimum_stock_units,p.sort_order,
       coalesce(sum(im.quantity_units),0)::int as physical_units,
       coalesce(sum(im.quantity_units) filter (
         where loc.type in ('warehouse','production')
           and (im.lot_id is null or (l.status='active' and l.best_before>=current_date))
       ),0)::int as saleable_units,
       coalesce((select sum(sr.quantity_units) from public.stock_reservations sr
                 where sr.product_id=p.id and sr.status='active'),0)::int as reserved_units,
       greatest(
        coalesce(sum(im.quantity_units) filter (
          where loc.type in ('warehouse','production')
            and (im.lot_id is null or (l.status='active' and l.best_before>=current_date))
        ),0)-
        coalesce((select sum(sr.quantity_units) from public.stock_reservations sr
                  where sr.product_id=p.id and sr.status='active'),0),0)::int as available_units
from public.products p
left join public.inventory_movements im on im.product_id=p.id and im.archived_at is null
left join public.inventory_locations loc on loc.id=im.location_id
left join public.lots l on l.id=im.lot_id
group by p.id;

create or replace view public.v_lot_stock_summary as
select l.id as lot_id,l.lot_number,l.best_before,l.status,
       coalesce(sum(im.quantity_units),0)::int as physical_units,
       coalesce(sum(im.quantity_units) filter (where loc.type in ('warehouse','production')),0)::int as warehouse_units,
       coalesce((select sum(a.quantity_units) from public.order_item_lot_allocations a
                 where a.lot_id=l.id and a.status in ('allocated','picked')),0)::int as allocated_units,
       case when l.status='active' and l.best_before>=current_date then
         greatest(coalesce(sum(im.quantity_units) filter (where loc.type in ('warehouse','production')),0)-
          coalesce((select sum(a.quantity_units) from public.order_item_lot_allocations a
                    where a.lot_id=l.id and a.status in ('allocated','picked')),0),0)::int
       else 0 end as available_units
from public.lots l
left join public.inventory_movements im on im.lot_id=l.id and im.archived_at is null
left join public.inventory_locations loc on loc.id=im.location_id
group by l.id;

create or replace function public.prevent_negative_inventory()
returns trigger language plpgsql set search_path=public,pg_temp as $$
declare v_balance bigint;
begin
  select coalesce(sum(quantity_units),0) into v_balance
  from public.inventory_movements
  where product_id=new.product_id and location_id=new.location_id
    and lot_id is not distinct from new.lot_id and archived_at is null;
  if v_balance<0 then raise exception 'A készlet nem kerülhet negatívba.'; end if;
  return new;
end $$;
drop trigger if exists trg_inventory_nonnegative on public.inventory_movements;
create constraint trigger trg_inventory_nonnegative
after insert or update on public.inventory_movements
deferrable initially immediate for each row execute function public.prevent_negative_inventory();

-- ---------------------------------------------------------------------------
-- 5. RENDELÉSI ÁLLAPOTTÖRTÉNET
-- ---------------------------------------------------------------------------

create table if not exists public.order_status_history (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  event_type text not null,
  old_order_status text,
  new_order_status text,
  old_fulfillment_status text,
  new_fulfillment_status text,
  old_finance_status text,
  new_finance_status text,
  note text,
  changed_by uuid references auth.users(id),
  changed_at timestamptz not null default now()
);

create or replace function public.log_order_status_change()
returns trigger language plpgsql set search_path=public,pg_temp as $$
begin
  if old.status is distinct from new.status
     or old.fulfillment_status is distinct from new.fulfillment_status
     or old.finance_status is distinct from new.finance_status then
    insert into public.order_status_history(
      order_id,event_type,old_order_status,new_order_status,
      old_fulfillment_status,new_fulfillment_status,
      old_finance_status,new_finance_status,changed_by
    ) values (
      new.id,'status_changed',old.status,new.status,
      old.fulfillment_status,new.fulfillment_status,
      old.finance_status,new.finance_status,auth.uid()
    );
  end if;
  return new;
end $$;
drop trigger if exists trg_order_status_history on public.orders;
create trigger trg_order_status_history after update on public.orders
for each row execute function public.log_order_status_change();

-- ---------------------------------------------------------------------------
-- 6. SZÁLLÍTÁS ÉS RÉSZLEGES ÁTADÁS
-- ---------------------------------------------------------------------------

create table if not exists public.shipping_runs (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  run_number text not null unique,
  run_year integer not null,
  run_sequence integer not null,
  planned_date date not null,
  status text not null default 'planned' check(status in ('planned','loading','in_transit','completed','cancelled')),
  driver_name text,
  vehicle text,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(run_year,run_sequence)
);

create or replace function public.set_shipping_run_number()
returns trigger language plpgsql set search_path=public,pg_temp as $$
begin
 new.run_year:=extract(year from new.planned_date)::int;
 if new.run_sequence is null or new.run_sequence<=0 then
  perform pg_advisory_xact_lock(hashtext('gellamille:shipping_run:'||new.run_year));
  select coalesce(max(run_sequence),0)+1 into new.run_sequence from public.shipping_runs where run_year=new.run_year;
 end if;
 new.run_number:='GM-SHP-'||new.run_year||'-'||lpad(new.run_sequence::text,6,'0');
 return new;
end $$;
drop trigger if exists trg_shipping_run_number on public.shipping_runs;
create trigger trg_shipping_run_number before insert on public.shipping_runs
for each row execute function public.set_shipping_run_number();

create table if not exists public.deliveries (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  shipping_run_id bigint references public.shipping_runs(id),
  order_id bigint not null references public.orders(id),
  partner_id bigint not null references public.partners(id),
  address_id bigint references public.partner_addresses(id),
  planned_date date not null,
  sequence_no integer,
  status text not null default 'planned' check(status in ('planned','picking','loaded','in_transit','partially_delivered','delivered','failed','cancelled')),
  failure_reason text,
  delivered_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.inventory_movements drop constraint if exists inventory_movements_delivery_fk;
alter table public.inventory_movements add constraint inventory_movements_delivery_fk foreign key(delivery_id) references public.deliveries(id);

create table if not exists public.delivery_items (
  id bigint generated always as identity primary key,
  delivery_id bigint not null references public.deliveries(id) on delete cascade,
  order_item_id bigint not null references public.order_items(id),
  product_id bigint not null references public.products(id),
  delivered_units integer not null check(delivered_units>0),
  net_amount_huf integer not null default 0,
  vat_amount_huf integer not null default 0,
  gross_amount_huf integer not null default 0,
  cogs_huf integer not null default 0,
  unique(delivery_id,order_item_id)
);

-- ---------------------------------------------------------------------------
-- 7. PÉNZÜGY
-- ---------------------------------------------------------------------------

create table if not exists public.receivables (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  receivable_number text not null unique,
  receivable_year integer not null,
  receivable_sequence integer not null,
  partner_id bigint not null references public.partners(id),
  order_id bigint not null references public.orders(id),
  delivery_id bigint not null unique references public.deliveries(id),
  net_amount_huf integer not null,
  vat_amount_huf integer not null,
  gross_amount_huf integer not null,
  delivered_at timestamptz not null,
  due_date date not null,
  status text not null default 'receivable' check(status in ('receivable','partially_paid','paid','overdue','void')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  unique(receivable_year,receivable_sequence)
);

create or replace function public.set_receivable_number()
returns trigger language plpgsql set search_path=public,pg_temp as $$
begin
 new.receivable_year:=extract(year from new.delivered_at)::int;
 if new.receivable_sequence is null or new.receivable_sequence<=0 then
  perform pg_advisory_xact_lock(hashtext('gellamille:receivable:'||new.receivable_year));
  select coalesce(max(receivable_sequence),0)+1 into new.receivable_sequence from public.receivables where receivable_year=new.receivable_year;
 end if;
 new.receivable_number:='GM-REC-'||new.receivable_year||'-'||lpad(new.receivable_sequence::text,6,'0');
 return new;
end $$;
drop trigger if exists trg_receivable_number on public.receivables;
create trigger trg_receivable_number before insert on public.receivables
for each row execute function public.set_receivable_number();

create table if not exists public.payments (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  partner_id bigint not null references public.partners(id),
  payment_date date not null,
  amount_huf integer not null check(amount_huf>0),
  payment_method text not null check(payment_method in ('bank_transfer','cash','card')),
  reference text,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.payment_allocations (
  id bigint generated always as identity primary key,
  payment_id bigint not null references public.payments(id) on delete cascade,
  receivable_id bigint not null references public.receivables(id),
  amount_huf integer not null check(amount_huf>0),
  unique(payment_id,receivable_id)
);

create table if not exists public.financial_adjustments (
  id bigint generated always as identity primary key,
  receivable_id bigint not null references public.receivables(id),
  type text not null check(type in ('credit','charge','return','discount','correction')),
  description text not null,
  amount_huf integer not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.expense_categories (
  id bigint generated always as identity primary key,
  name text not null unique,
  active boolean not null default true
);
insert into public.expense_categories(name) values
('Késztermék-beszerzés'),('Csomagolóanyag'),('Logisztika'),('Marketing'),
('Bér és megbízási díj'),('Működési költség'),('Adó és hatósági díj'),('Egyéb')
on conflict(name) do nothing;

create table if not exists public.expenses (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  category_id bigint references public.expense_categories(id),
  description text not null,
  performance_date date not null,
  payment_date date,
  net_amount_huf integer not null check(net_amount_huf>=0),
  vat_amount_huf integer not null default 0 check(vat_amount_huf>=0),
  gross_amount_huf integer not null check(gross_amount_huf>=0),
  status text not null default 'unpaid' check(status in ('unpaid','partially_paid','paid','void')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.member_loan_transactions (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  member_name text not null,
  transaction_type text not null check(transaction_type in ('funding','repayment')),
  transaction_date date not null,
  amount_huf integer not null check(amount_huf>0),
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create or replace view public.v_member_loan_balances as
select organization_id,member_name,
       sum(case when transaction_type='funding' then amount_huf else -amount_huf end)::bigint as outstanding_huf
  from public.member_loan_transactions
 where archived_at is null
 group by organization_id,member_name;

create or replace view public.v_receivables_open as
select r.id,r.receivable_number,r.partner_id,p.name as partner_name,r.order_id,o.order_number,
       r.delivery_id,r.net_amount_huf,r.vat_amount_huf,r.gross_amount_huf,r.delivered_at,r.due_date,
       coalesce((select sum(pa.amount_huf) from public.payment_allocations pa where pa.receivable_id=r.id),0)::int as paid_huf,
       (r.gross_amount_huf
        +coalesce((select sum(fa.amount_huf) from public.financial_adjustments fa where fa.receivable_id=r.id),0)
        -coalesce((select sum(pa.amount_huf) from public.payment_allocations pa where pa.receivable_id=r.id),0))::int as outstanding_huf,
       case
        when r.status='void' then 'void'
        when (r.gross_amount_huf+coalesce((select sum(fa.amount_huf) from public.financial_adjustments fa where fa.receivable_id=r.id),0)
             -coalesce((select sum(pa.amount_huf) from public.payment_allocations pa where pa.receivable_id=r.id),0))<=0 then 'paid'
        when r.due_date<current_date then 'overdue'
        when coalesce((select sum(pa.amount_huf) from public.payment_allocations pa where pa.receivable_id=r.id),0)>0 then 'partially_paid'
        else 'receivable' end as status
from public.receivables r
join public.partners p on p.id=r.partner_id
join public.orders o on o.id=r.order_id
where r.status<>'void';

create or replace function public.validate_payment_allocation()
returns trigger language plpgsql set search_path=public,pg_temp as $$
declare v_payment_amount bigint; v_payment_partner bigint; v_receivable_partner bigint;
        v_allocated_to_payment bigint; v_receivable_total bigint; v_allocated_to_receivable bigint;
begin
 select amount_huf,partner_id into v_payment_amount,v_payment_partner from public.payments where id=new.payment_id;
 select partner_id,gross_amount_huf+
        coalesce((select sum(amount_huf) from public.financial_adjustments where receivable_id=new.receivable_id),0)
   into v_receivable_partner,v_receivable_total
   from public.receivables where id=new.receivable_id and status<>'void';
 if v_payment_amount is null or v_receivable_total is null then raise exception 'A fizetés vagy követelés nem található.'; end if;
 if v_payment_partner<>v_receivable_partner then raise exception 'A fizetés és a követelés partnere eltér.'; end if;
 select coalesce(sum(amount_huf),0) into v_allocated_to_payment
   from public.payment_allocations where payment_id=new.payment_id and id<>coalesce(new.id,0);
 if v_allocated_to_payment+new.amount_huf>v_payment_amount then
   raise exception 'A fizetéshez rendelt összeg meghaladja a beérkezett pénzt.';
 end if;
 select coalesce(sum(amount_huf),0) into v_allocated_to_receivable
   from public.payment_allocations where receivable_id=new.receivable_id and id<>coalesce(new.id,0);
 if v_allocated_to_receivable+new.amount_huf>v_receivable_total then
   raise exception 'Túlfizetés nem rögzíthető. A követelés fennmaradó összege kisebb.';
 end if;
 return new;
end $$;
drop trigger if exists trg_validate_payment_allocation on public.payment_allocations;
create trigger trg_validate_payment_allocation before insert or update on public.payment_allocations
for each row execute function public.validate_payment_allocation();

create or replace function public.refresh_receivable_and_order_status()
returns trigger language plpgsql set search_path=public,pg_temp as $$
declare v_receivable_id bigint; v_order_id bigint; v_status text;
begin
 v_receivable_id:=case when tg_op='DELETE' then old.receivable_id else new.receivable_id end;
 select order_id into v_order_id from public.receivables where id=v_receivable_id;
 if v_order_id is null then
   if tg_op='DELETE' then return old; else return new; end if;
 end if;
 select status into v_status from public.v_receivables_open where id=v_receivable_id;
 update public.receivables set status=coalesce(v_status,status) where id=v_receivable_id and status<>'void';
 update public.orders o set finance_status=case
   when exists(select 1 from public.v_receivables_open v where v.order_id=o.id and v.status='overdue') then 'overdue'
   when not exists(select 1 from public.v_receivables_open v where v.order_id=o.id and v.outstanding_huf>0) then 'paid'
   when exists(select 1 from public.v_receivables_open v where v.order_id=o.id and v.paid_huf>0) then 'partially_paid'
   else 'receivable' end
 where o.id=v_order_id;
 if tg_op='DELETE' then return old; else return new; end if;
end $$;
drop trigger if exists trg_payment_allocation_refresh on public.payment_allocations;
create trigger trg_payment_allocation_refresh after insert or update or delete on public.payment_allocations
for each row execute function public.refresh_receivable_and_order_status();
drop trigger if exists trg_financial_adjustment_refresh on public.financial_adjustments;
create trigger trg_financial_adjustment_refresh after insert or update or delete on public.financial_adjustments
for each row execute function public.refresh_receivable_and_order_status();

-- Átadás után automatikus követelés.
create or replace function public.post_delivered_receivable()
returns trigger language plpgsql set search_path=public,pg_temp as $$
declare
 v_net int; v_vat int; v_gross int; v_terms int; v_org bigint; v_payment_method text;
 v_order_total int; v_fulfilled int;
begin
 if new.status='delivered' and old.status is distinct from 'delivered' then
   select coalesce(sum(net_amount_huf),0),coalesce(sum(vat_amount_huf),0),
          coalesce(sum(gross_amount_huf),0)
     into v_net,v_vat,v_gross from public.delivery_items where delivery_id=new.id;
   if v_gross<=0 then raise exception 'Átadás tételek nélkül nem zárható le.'; end if;

   select p.payment_terms_days,p.organization_id,o.payment_method
     into v_terms,v_org,v_payment_method
     from public.partners p join public.orders o on o.id=new.order_id
    where p.id=new.partner_id;
   if v_payment_method in ('cash_on_delivery','card_on_delivery') then v_terms:=0; end if;

   insert into public.receivables(
     organization_id,receivable_number,receivable_year,receivable_sequence,
     partner_id,order_id,delivery_id,net_amount_huf,vat_amount_huf,gross_amount_huf,
     delivered_at,due_date,created_by
   ) values (
     v_org,'TEMP',extract(year from coalesce(new.delivered_at,now()))::int,0,
     new.partner_id,new.order_id,new.id,v_net,v_vat,v_gross,
     coalesce(new.delivered_at,now()),
     (coalesce(new.delivered_at,now())::date+v_terms),auth.uid()
   ) on conflict(delivery_id) do nothing;

   select sum(unit_quantity-cancelled_quantity),sum(fulfilled_quantity)
     into v_order_total,v_fulfilled from public.order_items where order_id=new.order_id;

   update public.orders set
      fulfillment_status=case when v_fulfilled>=v_order_total then 'delivered' else 'partially_delivered' end,
      finance_status='receivable',
      status=case when v_fulfilled>=v_order_total then 'closed' else status end
    where id=new.order_id;
 end if;
 return new;
end $$;
drop trigger if exists trg_delivery_receivable on public.deliveries;
create trigger trg_delivery_receivable after update of status on public.deliveries
for each row execute function public.post_delivered_receivable();

-- ---------------------------------------------------------------------------
-- 8. VISSZÁRU, VISSZAHÍVÁS, LELTÁR
-- ---------------------------------------------------------------------------

create table if not exists public.returns (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  return_number text not null unique,
  return_year integer not null,
  return_sequence integer not null,
  partner_id bigint not null references public.partners(id),
  order_id bigint references public.orders(id),
  status text not null default 'received' check(status in ('received','quarantine','restocked','scrapped','closed','cancelled')),
  reason text not null,
  received_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  unique(return_year,return_sequence)
);

create or replace function public.set_return_number()
returns trigger language plpgsql set search_path=public,pg_temp as $$
begin
 new.return_year:=extract(year from new.received_at)::int;
 if new.return_sequence is null or new.return_sequence<=0 then
  perform pg_advisory_xact_lock(hashtext('gellamille:return:'||new.return_year));
  select coalesce(max(return_sequence),0)+1 into new.return_sequence from public.returns where return_year=new.return_year;
 end if;
 new.return_number:='GM-RET-'||new.return_year||'-'||lpad(new.return_sequence::text,6,'0');
 return new;
end $$;
drop trigger if exists trg_return_number on public.returns;
create trigger trg_return_number before insert on public.returns
for each row execute function public.set_return_number();

create table if not exists public.return_items (
  id bigint generated always as identity primary key,
  return_id bigint not null references public.returns(id) on delete cascade,
  product_id bigint not null references public.products(id),
  lot_id bigint references public.lots(id),
  quantity_units integer not null check(quantity_units>0),
  disposition text check(disposition in ('quarantine','restock','scrap')),
  credit_gross_huf integer not null default 0
);
alter table public.inventory_movements drop constraint if exists inventory_movements_return_fk;
alter table public.inventory_movements add constraint inventory_movements_return_fk foreign key(return_id) references public.returns(id);

create table if not exists public.product_recalls (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  title text not null,
  reason text not null,
  status text not null default 'open' check(status in ('open','closed','cancelled')),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  created_by uuid references auth.users(id)
);
create table if not exists public.product_recall_lots (
  recall_id bigint not null references public.product_recalls(id) on delete cascade,
  lot_id bigint not null references public.lots(id),
  primary key(recall_id,lot_id)
);

create table if not exists public.stocktakes (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  location_id bigint not null references public.inventory_locations(id),
  status text not null default 'draft' check(status in ('draft','counting','submitted','finalized','cancelled')),
  counted_by uuid references auth.users(id),
  finalized_by uuid references auth.users(id),
  started_at timestamptz not null default now(),
  finalized_at timestamptz,
  note text
);
create table if not exists public.stocktake_items (
  id bigint generated always as identity primary key,
  stocktake_id bigint not null references public.stocktakes(id) on delete cascade,
  product_id bigint not null references public.products(id),
  lot_id bigint references public.lots(id),
  system_quantity integer not null,
  counted_quantity integer,
  difference_quantity integer generated always as (coalesce(counted_quantity,system_quantity)-system_quantity) stored,
  reason text,
  unique(stocktake_id,product_id,lot_id)
);
alter table public.inventory_movements drop constraint if exists inventory_movements_stocktake_fk;
alter table public.inventory_movements add constraint inventory_movements_stocktake_fk foreign key(stocktake_id) references public.stocktakes(id);

create or replace function public.protect_voided_lot_with_history()
returns trigger language plpgsql set search_path=public,pg_temp as $$
begin
 if old.status='active' and new.status='void' then
   if exists(select 1 from public.inventory_movements where lot_id=old.id and movement_type='delivery_issue')
      or exists(select 1 from public.order_item_lot_allocations where lot_id=old.id and status='delivered') then
     raise exception 'Már kiadott LOT nem sztornózható, csak visszahívható.';
   end if;
 end if;
 return new;
end $$;
drop trigger if exists trg_protect_voided_lot on public.lots;
create trigger trg_protect_voided_lot before update of status on public.lots
for each row execute function public.protect_voided_lot_with_history();

create or replace function public.zero_voided_lot_inventory()
returns trigger language plpgsql set search_path=public,pg_temp as $$
declare r record;
begin
 if new.status='void' and old.status is distinct from 'void' then
   for r in
     select im.organization_id,im.product_id,im.location_id,
            sum(im.quantity_units)::int as balance
       from public.inventory_movements im
      where im.lot_id=new.id and im.archived_at is null
      group by im.organization_id,im.product_id,im.location_id
     having sum(im.quantity_units)>0
   loop
     insert into public.inventory_movements(
       organization_id,product_id,lot_id,location_id,movement_type,quantity_units,
       unit_cost_huf,reason,created_by
     ) values(
       r.organization_id,r.product_id,new.id,r.location_id,'correction',-r.balance,
       new.purchase_unit_price_huf,'LOT sztornózás miatti készletnullázás',auth.uid()
     );
   end loop;
 end if;
 return new;
end $$;
drop trigger if exists trg_zero_voided_lot_inventory on public.lots;
create trigger trg_zero_voided_lot_inventory after update of status on public.lots
for each row execute function public.zero_voided_lot_inventory();

create or replace function public.apply_product_recall_lot()
returns trigger language plpgsql set search_path=public,pg_temp as $$
declare v_reason text; v_org bigint; v_product bigint;
begin
 select reason,organization_id into v_reason,v_org from public.product_recalls where id=new.recall_id;
 update public.lots
    set status='recalled',recalled_at=now(),recall_reason=v_reason
  where id=new.lot_id and status not in ('void','scrapped');
 update public.order_item_lot_allocations
    set status='released'
  where lot_id=new.lot_id and status in ('allocated','picked');
 select p.id into v_product
   from public.lots l join public.products p on p.flavor_code=l.flavor_code and p.size_ml=l.size_ml
  where l.id=new.lot_id and p.organization_id=v_org limit 1;
 insert into public.tasks(organization_id,title,description,product_id,priority,source,created_by)
 values(v_org,'Visszahívott LOT kezelése',coalesce(v_reason,'Termékvisszahívás')||' – LOT: '||(select lot_number from public.lots where id=new.lot_id),v_product,'urgent','recall',auth.uid());
 return new;
end $$;
drop trigger if exists trg_apply_product_recall_lot on public.product_recall_lots;
create trigger trg_apply_product_recall_lot after insert on public.product_recall_lots
for each row execute function public.apply_product_recall_lot();

-- ---------------------------------------------------------------------------
-- 9. ALAPANYAGOK ÉS RECEPTEK
-- ---------------------------------------------------------------------------

create table if not exists public.units (
  id bigint generated always as identity primary key,
  code text not null unique,
  name text not null,
  dimension text not null check(dimension in ('mass','volume','count','packaging'))
);
insert into public.units(code,name,dimension) values
('kg','kilogramm','mass'),('g','gramm','mass'),('l','liter','volume'),('ml','milliliter','volume'),
('db','darab','count'),('karton','karton','packaging'),('tekercs','tekercs','packaging')
on conflict(code) do nothing;

create table if not exists public.unit_conversions (
  id bigint generated always as identity primary key,
  from_unit_id bigint not null references public.units(id),
  to_unit_id bigint not null references public.units(id),
  multiplier numeric(18,6) not null check(multiplier>0),
  unique(from_unit_id,to_unit_id)
);

create table if not exists public.materials (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  code text not null,
  name text not null,
  category text not null check(category in ('ingredient','packaging','label','lid','container','auxiliary')),
  base_unit_id bigint not null references public.units(id),
  allergen_info text,
  supplier_name text,
  minimum_stock_quantity numeric(18,3) not null default 0,
  current_unit_cost_huf numeric(18,2) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  archived_at timestamptz,
  unique(organization_id,code)
);

create table if not exists public.material_inventory_movements (
  id bigint generated always as identity primary key,
  material_id bigint not null references public.materials(id),
  location_id bigint not null references public.inventory_locations(id),
  movement_type text not null check(movement_type in ('receipt','usage','correction','transfer_in','transfer_out','stocktake','scrap')),
  quantity numeric(18,3) not null check(quantity<>0),
  reason text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create or replace view public.v_material_stock as
select m.id as material_id,coalesce(sum(mm.quantity),0) as stock_quantity
from public.materials m left join public.material_inventory_movements mm on mm.material_id=m.id
group by m.id;

create table if not exists public.recipes (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  product_id bigint not null references public.products(id),
  name text not null,
  active boolean not null default true,
  unique(product_id,name)
);
create table if not exists public.recipe_versions (
  id bigint generated always as identity primary key,
  recipe_id bigint not null references public.recipes(id) on delete cascade,
  version_no integer not null,
  status text not null default 'draft' check(status in ('draft','active','retired')),
  effective_from date,
  effective_to date,
  output_units integer not null default 1 check(output_units>0),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique(recipe_id,version_no)
);
create table if not exists public.recipe_components (
  id bigint generated always as identity primary key,
  recipe_version_id bigint not null references public.recipe_versions(id) on delete cascade,
  material_id bigint not null references public.materials(id),
  quantity numeric(18,3) not null check(quantity>0),
  unit_id bigint not null references public.units(id),
  unique(recipe_version_id,material_id)
);

-- ---------------------------------------------------------------------------
-- 10. FELADATOK ÉS ÉRTESÍTÉSEK
-- ---------------------------------------------------------------------------

create table if not exists public.tasks (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  title text not null,
  description text,
  partner_id bigint references public.partners(id),
  order_id bigint references public.orders(id),
  delivery_id bigint references public.deliveries(id),
  product_id bigint references public.products(id),
  assigned_to uuid references auth.users(id),
  due_at timestamptz,
  priority text not null default 'normal' check(priority in ('low','normal','high','urgent')),
  status text not null default 'open' check(status in ('open','in_progress','done','cancelled')),
  source text not null default 'manual' check(source in ('manual','overdue','inactive_partner','low_stock','expiry','failed_delivery','partner_followup','recall')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  archived_at timestamptz
);

create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  user_id uuid references auth.users(id),
  role_code text,
  type text not null,
  title text not null,
  body text,
  entity_type text,
  entity_id text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_recipients (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  event_type text not null,
  name text,
  email text not null,
  active boolean not null default true,
  unique(organization_id,event_type,email)
);

create table if not exists public.email_outbox (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  event_type text not null,
  recipient_email text not null,
  subject text not null,
  body_text text not null,
  payload jsonb,
  status text not null default 'queued' check(status in ('queued','sent','failed','cancelled')),
  attempts integer not null default 0,
  last_error text,
  processing_started_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_at timestamptz
);
alter table public.email_outbox add column if not exists processing_started_at timestamptz;
alter table public.email_outbox add column if not exists updated_at timestamptz not null default now();
alter table public.email_outbox drop constraint if exists email_outbox_status_check;
alter table public.email_outbox add constraint email_outbox_status_check
  check(status in ('queued','processing','sent','failed','cancelled'));

create or replace function public.queue_submitted_order_email()
returns trigger language plpgsql set search_path=public,pg_temp as $$
declare r record; v_partner text;
begin
 if new.status='submitted' and old.status is distinct from 'submitted' then
   select name into v_partner from public.partners where id=new.partner_id;
   for r in select email from public.notification_recipients
             where organization_id=new.organization_id and event_type='new_order' and active=true
   loop
     insert into public.email_outbox(organization_id,event_type,recipient_email,subject,body_text,payload)
     values(new.organization_id,'new_order',r.email,
       'Új Gellamille rendelés – '||new.order_number,
       v_partner||' új rendelést küldött be. Bruttó összeg: '||new.gross_total_huf||' Ft.',
       jsonb_build_object('order_id',new.id,'order_number',new.order_number,'partner',v_partner));
   end loop;
 end if;
 return new;
end $$;
drop trigger if exists trg_order_email_queue on public.orders;
create trigger trg_order_email_queue after update of status on public.orders
for each row execute function public.queue_submitted_order_email();

-- 30 napos lejáratfigyelés és automatikus lejáratás.
create or replace function public.run_daily_inventory_maintenance()
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_expiring int; v_expired int; v_released int;
begin
 insert into public.tasks(organization_id,title,description,product_id,due_at,priority,source)
 select distinct l.organization_id,'LOT 30 napon belül lejár',
        l.lot_number||' lejárata: '||l.best_before,p.id,l.best_before::timestamptz,'high','expiry'
 from public.lots l
 join public.products p on p.flavor_code=l.flavor_code and p.size_ml=l.size_ml
 where l.status='active' and l.best_before=current_date+30
 and not exists(select 1 from public.tasks t where t.source='expiry' and t.description like l.lot_number||'%' and t.archived_at is null);
 get diagnostics v_expiring=row_count;

 -- Lejárt LOT-kiosztás nem maradhat aktív. A termékszintű foglalás megmarad,
 -- így a rendelés egy másik, érvényes LOT-ból újra összekészíthető.
 update public.order_item_lot_allocations a
    set status='released'
   from public.lots l
  where a.lot_id=l.id and a.status in ('allocated','picked')
    and l.status='active' and l.best_before<current_date;
 get diagnostics v_released=row_count;

 with expiring_stock as materialized (
   select l.organization_id,p.id as product_id,l.id as lot_id,
          central.id as central_location_id,quarantine.id as quarantine_location_id,
          l.purchase_unit_price_huf,
          coalesce((select sum(im.quantity_units) from public.inventory_movements im
                    where im.lot_id=l.id and im.location_id=central.id and im.archived_at is null),0)::int as physical_units
   from public.lots l
   join public.products p on p.flavor_code=l.flavor_code and p.size_ml=l.size_ml
   join public.inventory_locations central on central.organization_id=l.organization_id and central.code='CENTRAL'
   join public.inventory_locations quarantine on quarantine.organization_id=l.organization_id and quarantine.code='QUARANTINE'
   where l.status='active' and l.best_before<current_date
 )
 insert into public.inventory_movements(organization_id,product_id,lot_id,location_id,movement_type,quantity_units,unit_cost_huf,reason)
 select organization_id,product_id,lot_id,central_location_id,'transfer_out',-physical_units,purchase_unit_price_huf,'Automatikus áthelyezés lejárat miatt'
   from expiring_stock where physical_units>0
 union all
 select organization_id,product_id,lot_id,quarantine_location_id,'transfer_in',physical_units,purchase_unit_price_huf,'Automatikus áthelyezés lejárat miatt'
   from expiring_stock where physical_units>0;
 get diagnostics v_expired=row_count;

 update public.lots set status='expired'
  where status='active' and best_before<current_date;

 update public.orders o set fulfillment_status='picking'
  where fulfillment_status='packed'
    and exists (
      select 1 from public.order_items oi
      where oi.order_id=o.id
        and oi.reserved_quantity > coalesce((
          select sum(a.quantity_units) from public.order_item_lot_allocations a
           where a.order_item_id=oi.id and a.status in ('allocated','picked')
        ),0)
    );

 return jsonb_build_object(
   'expiry_tasks',v_expiring,
   'released_expired_allocations',v_released,
   'expired_stock_movements',v_expired
 );
end $$;

-- ---------------------------------------------------------------------------
-- 11. FRISSÍTÉSI TRIGGEREK, RLS, NAPLÓZÁS
-- ---------------------------------------------------------------------------

do $$
declare t text;
begin
 foreach t in array array[
  'organizations','partner_addresses','shipping_runs','deliveries'
 ] loop
  execute format('drop trigger if exists trg_%I_updated on public.%I',t,t);
  execute format('create trigger trg_%I_updated before update on public.%I for each row execute function public.touch_updated_at()',t,t);
 end loop;
end $$;

-- A V7 táblák kizárólag szerveroldali DATABASE_URL kapcsolaton keresztül írhatók/olvashatók.
do $$
declare t text;
begin
 foreach t in array array[
  'organizations','roles','permissions','role_permissions','partner_addresses','partner_contacts',
  'price_lists','price_list_items','order_adjustments','inventory_locations','inventory_movements',
  'stock_reservations','order_item_lot_allocations','order_status_history','shipping_runs','deliveries',
  'delivery_items','receivables','payments','payment_allocations','financial_adjustments',
  'expense_categories','expenses','member_loan_transactions','returns','return_items','product_recalls','product_recall_lots',
  'stocktakes','stocktake_items','units','unit_conversions','materials','material_inventory_movements',
  'recipes','recipe_versions','recipe_components','tasks','notifications','notification_recipients','email_outbox'
 ] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on table public.%I from anon, authenticated',t);
 end loop;
end $$;

insert into public.gellamille_schema_migrations(version,description,checksum,applied_at,applied_by)
values(
 '008',
 'Gellamille V7 unified operating system: dashboard, inventory, FEFO, partial delivery, finance, materials, tasks and permissions',
 encode(digest('gellamille-v7-008-unified-operating-system-2026-06-17','sha256'),'hex'),
 now(),current_user
)
on conflict(version) do update set
 description=excluded.description,checksum=excluded.checksum,applied_at=excluded.applied_at,applied_by=excluded.applied_by;

insert into public.audit_log(action,entity_type,entity_id,after_data)
values('system.migration.applied','schema_migration','008',
 jsonb_build_object('description','Gellamille V7 unified operating system','applied_at',now(),'applied_by',current_user));

commit;
