-- 1. Supabase Authentication → Users alatt előbb hozd létre a felhasználót.
-- 2. Írd át az e-mail-címet, majd futtasd ezt a fájlt.
update public.app_users au
set role='admin',active=true,partner_id=null,
    organization_id=(select id from public.organizations where name='Gellamille'),
    display_name=coalesce(au.display_name,'Admin')
where lower(au.email)=lower('CSERELD_KI_ADMIN_EMAILRE');

select user_id,email,display_name,role,active from public.app_users
where lower(email)=lower('CSERELD_KI_ADMIN_EMAILRE');
