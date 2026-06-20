-- Gellamille V7 – kizárólag olvasó telepítés-ellenőrzés
with checks as (
  select 'migration_008' code, exists(select 1 from public.gellamille_schema_migrations where version='008') ok, 'A 008 migráció rögzítve.' description
  union all select 'organization', (select count(*)=1 from public.organizations where name='Gellamille' and active), 'A Gellamille szervezet létezik.'
  union all select 'sixteen_products', (select count(*)=16 from public.products where active), 'Pontosan 16 aktív SKU van.'
  union all select 'product_identity', not exists(select 1 from public.products where sku is null or name is null or organization_id is null), 'Minden termékhez név, SKU és szervezet tartozik.'
  union all select 'central_location', exists(select 1 from public.inventory_locations where code='CENTRAL' and active), 'A Központi raktár létezik.'
  union all select 'inventory_tables', to_regclass('public.inventory_movements') is not null and to_regclass('public.stock_reservations') is not null and to_regclass('public.order_item_lot_allocations') is not null, 'A készlet, foglalás és LOT-kiosztás táblái léteznek.'
  union all select 'inventory_nonnegative', not exists(select 1 from public.v_product_stock_summary where physical_units<0 or available_units<0), 'Nincs negatív termékkészlet.'
  union all select 'order_status_model', to_regclass('public.order_status_history') is not null, 'A rendelési állapottörténet létezik.'
  union all select 'delivery_finance', to_regclass('public.deliveries') is not null and to_regclass('public.receivables') is not null and to_regclass('public.v_receivables_open') is not null, 'Az átadás és követelés modell létezik.'
  union all select 'member_loans', to_regclass('public.member_loan_transactions') is not null and to_regclass('public.v_member_loan_balances') is not null, 'A tagi kölcsön külön, nem árbevételként kezelhető.'
  union all select 'materials_recipes', to_regclass('public.materials') is not null and to_regclass('public.recipe_versions') is not null, 'Az alapanyag- és receptadatbázis létezik.'
  union all select 'tasks_notifications', to_regclass('public.tasks') is not null and to_regclass('public.email_outbox') is not null, 'A feladat- és értesítési rendszer létezik.'
  union all select 'one_partner_login', to_regclass('public.app_users_one_login_per_partner_idx') is not null, 'Egy partnerhez legfeljebb egy belépés tartozhat.'
  union all select 'lot_lifecycle', exists(select 1 from pg_constraint where conname='lots_status_v7_check'), 'A LOT életciklus V7 ellenőrzése aktív.'
), summary as (
  select count(*)::int total_checks,count(*) filter(where not ok)::int failed_checks from checks
)
select jsonb_pretty(jsonb_build_object(
  'migration_verified',(select failed_checks=0 from summary),
  'summary',(select to_jsonb(summary) from summary),
  'checks',(select jsonb_agg(to_jsonb(checks) order by code) from checks),
  'row_counts',jsonb_build_object(
    'products',(select count(*) from public.products),
    'lots',(select count(*) from public.lots),
    'orders',(select count(*) from public.orders),
    'partners',(select count(*) from public.partners),
    'inventory_movements',(select count(*) from public.inventory_movements)
  )
)) as gellamille_v7_verification_report;
