-- GELLAMILLE V7.1 - BILLING FOUNDATION
-- Internal billing workspace and Szamlazz.hu integration staging tables.

begin;

set local lock_timeout = '10s';
set local statement_timeout = '180s';
select pg_advisory_xact_lock(hashtext('gellamille:v7.1:migration:016'));

create table if not exists public.billing_documents (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  partner_id bigint not null references public.partners(id),
  order_id bigint references public.orders(id),
  delivery_id bigint references public.deliveries(id),
  receivable_id bigint references public.receivables(id),
  document_type text not null default 'invoice' check(document_type in ('invoice','proforma','storno','credit_note')),
  source text not null default 'manual' check(source in ('manual','delivery','szamlazz_hu')),
  direction text not null default 'outgoing' check(direction in ('outgoing','incoming')),
  status text not null default 'draft' check(status in (
    'draft','ready','queued','sent','issued','partially_paid','paid','overdue','failed','void','cancelled'
  )),
  issue_date date,
  fulfillment_date date,
  due_date date,
  currency text not null default 'HUF',
  net_amount_huf integer not null default 0 check(net_amount_huf>=0),
  vat_amount_huf integer not null default 0 check(vat_amount_huf>=0),
  gross_amount_huf integer not null default 0 check(gross_amount_huf>=0),
  external_provider text,
  external_invoice_id text,
  external_invoice_number text,
  external_pdf_url text,
  payment_status text not null default 'unknown' check(payment_status in ('unknown','unpaid','partially_paid','paid','overpaid')),
  paid_huf integer not null default 0 check(paid_huf>=0),
  last_synced_at timestamptz,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  archived_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(receivable_id),
  unique(external_provider, external_invoice_id),
  unique(external_provider, external_invoice_number)
);

create index if not exists billing_documents_org_status_idx
  on public.billing_documents(organization_id, archived_at, status, due_date);
create index if not exists billing_documents_partner_idx
  on public.billing_documents(partner_id, created_at desc);
create index if not exists billing_documents_order_idx
  on public.billing_documents(order_id);
create index if not exists billing_documents_external_idx
  on public.billing_documents(external_provider, external_invoice_number);

create table if not exists public.billing_document_items (
  id bigint generated always as identity primary key,
  billing_document_id bigint not null references public.billing_documents(id) on delete cascade,
  order_item_id bigint references public.order_items(id),
  product_id bigint references public.products(id),
  item_name text not null,
  quantity_units integer not null check(quantity_units>0),
  unit text not null default 'db',
  net_unit_price_huf integer not null default 0 check(net_unit_price_huf>=0),
  net_amount_huf integer not null default 0 check(net_amount_huf>=0),
  vat_rate_bps integer not null default 2700 check(vat_rate_bps>=0),
  vat_amount_huf integer not null default 0 check(vat_amount_huf>=0),
  gross_amount_huf integer not null default 0 check(gross_amount_huf>=0),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.billing_events (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  billing_document_id bigint references public.billing_documents(id) on delete cascade,
  event_type text not null,
  provider text,
  external_event_id text,
  status_before text,
  status_after text,
  payload jsonb not null default '{}'::jsonb,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists billing_events_doc_created_idx
  on public.billing_events(billing_document_id, created_at desc);
create index if not exists billing_events_org_created_idx
  on public.billing_events(organization_id, created_at desc);

create table if not exists public.billing_provider_settings (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  provider text not null default 'szamlazz_hu',
  environment text not null default 'production' check(environment in ('sandbox','production')),
  status text not null default 'not_configured' check(status in ('not_configured','configured','disabled','error')),
  agent_key_secret_name text,
  webhook_secret_secret_name text,
  default_invoice_prefix text,
  default_payment_method text,
  settings jsonb not null default '{}'::jsonb,
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, provider, environment)
);

create table if not exists public.billing_provider_messages (
  id bigint generated always as identity primary key,
  organization_id bigint not null references public.organizations(id),
  provider text not null default 'szamlazz_hu',
  direction text not null check(direction in ('outbound','inbound')),
  message_type text not null,
  billing_document_id bigint references public.billing_documents(id),
  status text not null default 'received' check(status in ('queued','sent','received','processed','failed','ignored')),
  request_payload jsonb,
  response_payload jsonb,
  error_message text,
  received_at timestamptz,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists billing_provider_messages_org_idx
  on public.billing_provider_messages(organization_id, provider, created_at desc);

create or replace function public.touch_billing_document()
returns trigger language plpgsql set search_path=public,pg_temp as $$
begin
  new.updated_at:=now();
  return new;
end $$;

drop trigger if exists trg_billing_documents_updated on public.billing_documents;
create trigger trg_billing_documents_updated before update on public.billing_documents
for each row execute function public.touch_billing_document();

drop trigger if exists trg_billing_provider_settings_updated on public.billing_provider_settings;
create trigger trg_billing_provider_settings_updated before update on public.billing_provider_settings
for each row execute function public.touch_billing_document();

insert into public.billing_documents(
  organization_id,partner_id,order_id,delivery_id,receivable_id,document_type,source,status,
  issue_date,fulfillment_date,due_date,net_amount_huf,vat_amount_huf,gross_amount_huf,
  payment_status,paid_huf,metadata
)
select
  r.organization_id,r.partner_id,r.order_id,r.delivery_id,r.id,'invoice','delivery',
  case
    when v.status='paid' then 'paid'
    when v.status='partially_paid' then 'partially_paid'
    when v.status='overdue' then 'overdue'
    else 'ready'
  end,
  null,r.delivered_at::date,r.due_date,r.net_amount_huf,r.vat_amount_huf,r.gross_amount_huf,
  case
    when v.status='paid' then 'paid'
    when v.status='partially_paid' then 'partially_paid'
    else 'unpaid'
  end,
  coalesce(v.paid_huf,0),
  jsonb_build_object('created_from_receivable',true,'receivable_number',r.receivable_number)
from public.receivables r
left join public.v_receivables_open v on v.id=r.id
where r.archived_at is null
on conflict(receivable_id) do nothing;

insert into public.billing_document_items(
  billing_document_id,order_item_id,product_id,item_name,quantity_units,unit,
  net_unit_price_huf,net_amount_huf,vat_rate_bps,vat_amount_huf,gross_amount_huf
)
select
  bd.id,di.order_item_id,di.product_id,
  coalesce(oi.product_name_snapshot,p.name,'Termék'),
  di.delivered_units,'db',
  coalesce(oi.net_unit_price_huf_snapshot,0),
  di.net_amount_huf,
  coalesce(p.vat_rate_bps,2700),
  di.vat_amount_huf,
  di.gross_amount_huf
from public.billing_documents bd
join public.delivery_items di on di.delivery_id=bd.delivery_id
left join public.order_items oi on oi.id=di.order_item_id
left join public.products p on p.id=di.product_id
where not exists (
  select 1 from public.billing_document_items bdi
  where bdi.billing_document_id=bd.id and bdi.order_item_id=di.order_item_id
);

do $$
declare t text;
begin
 foreach t in array array[
  'billing_documents','billing_document_items','billing_events',
  'billing_provider_settings','billing_provider_messages'
 ] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on table public.%I from anon, authenticated',t);
 end loop;
end $$;

insert into public.gellamille_schema_migrations(version,description,checksum,applied_at,applied_by)
values(
 '016',
 'Gellamille V7.1 billing foundation and Szamlazz.hu integration staging',
 encode(digest('gellamille-v7.1-016-billing-foundation-2026-06-28','sha256'),'hex'),
 now(),current_user
)
on conflict(version) do update set
 description=excluded.description,checksum=excluded.checksum,applied_at=excluded.applied_at,applied_by=excluded.applied_by;

insert into public.audit_log(action,entity_type,entity_id,after_data)
values('system.migration.applied','schema_migration','016',
 jsonb_build_object('description','Billing foundation','applied_at',now(),'applied_by',current_user));

commit;
