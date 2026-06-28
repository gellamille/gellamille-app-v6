begin;

create table if not exists public.inventory_stock_settings (
  organization_id bigint primary key references public.organizations(id) on delete cascade,
  low_surplus_units integer not null default 200 check(low_surplus_units >= 0),
  medium_surplus_units integer not null default 500 check(medium_surplus_units >= 0),
  high_surplus_units integer not null default 1000 check(high_surplus_units >= 0),
  overstock_surplus_units integer not null default 2000 check(overstock_surplus_units >= 0),
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  check(low_surplus_units <= medium_surplus_units),
  check(medium_surplus_units <= high_surplus_units),
  check(high_surplus_units <= overstock_surplus_units)
);

insert into public.inventory_stock_settings(organization_id)
select id from public.organizations
on conflict(organization_id) do nothing;

commit;
