-- Gellamille V7 – végleges böngészős lezárás
-- CSAK akkor futtasd, amikor az új Next.js alkalmazás már sikeresen működik.
-- A szerveroldali DATABASE_URL kapcsolat továbbra is hozzáfér, az anon/authenticated
-- Supabase kliens viszont nem tud közvetlenül üzleti táblát vagy régi RPC-t használni.

begin;

revoke all on table
  public.flavors,
  public.operators,
  public.lots,
  public.lot_events,
  public.partners,
  public.shipments,
  public.shipment_items,
  public.shipment_events,
  public.products,
  public.ordering_settings,
  public.partner_delivery_days,
  public.orders,
  public.order_items,
  public.order_allocations,
  public.app_users,
  public.audit_log,
  public.idempotency_keys
from anon, authenticated;

revoke all on public.lot_stock from anon, authenticated;

revoke all on function public.create_gellamille_lot(date,text,text,smallint,integer,bigint,text)
  from public, anon, authenticated;
revoke all on function public.void_gellamille_lot(bigint,text)
  from public, anon, authenticated;
revoke all on function public.add_gellamille_operator(text)
  from public, anon, authenticated;
revoke all on function public.create_gellamille_partner(text,text,text,text,text,text,text,text)
  from public, anon, authenticated;
revoke all on function public.create_gellamille_shipment(bigint,date,text,text,text,text)
  from public, anon, authenticated;
revoke all on function public.set_gellamille_shipment_item(bigint,bigint,integer)
  from public, anon, authenticated;
revoke all on function public.remove_gellamille_shipment_item(bigint)
  from public, anon, authenticated;
revoke all on function public.advance_gellamille_shipment(bigint,text)
  from public, anon, authenticated;
revoke all on function public.void_gellamille_shipment(bigint,text)
  from public, anon, authenticated;
revoke all on function public.submit_gellamille_order(bigint)
  from public, anon, authenticated;

insert into public.audit_log(action,entity_type,entity_id,after_data)
values(
  'system.cutover.lockdown',
  'security',
  'v7',
  jsonb_build_object('applied_at',now(),'applied_by',current_user)
);

commit;
