-- Példa: a partner ID-t és a címet írd át.
insert into public.partner_addresses(partner_id,name,postal_code,city,address_line1,is_default)
values(0,'Fő üzlet','2600','Vác','Minta utca 1.',true);

-- Engedélyezett szállítási nap: ISO hétfő=1 ... vasárnap=7.
insert into public.partner_delivery_days(partner_id,weekday,cutoff_business_days,active)
values(0,3,2,true)
on conflict(partner_id,weekday) do update set cutoff_business_days=excluded.cutoff_business_days,active=true;
