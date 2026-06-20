-- Új rendelés e-mail címzettje. Több címzett is rögzíthető.
insert into public.notification_recipients(organization_id,event_type,name,email,active)
select id,'new_order','Rendeléskezelő','CSERELD_KI_EMAILRE',true
from public.organizations where name='Gellamille'
on conflict(organization_id,event_type,email) do update set active=true,name=excluded.name;
