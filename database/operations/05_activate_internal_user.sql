-- Belső felhasználó aktiválása.
-- A szerepkör lehet: management, staff, production, warehouse, finance vagy sales.
-- Előbb hozd létre a felhasználót a Supabase Authentication → Users felületén.
do $$
declare
  v_email text := 'CSERELD_KI_EMAILRE';
  v_role text := 'production';
begin
  if v_role not in ('management','staff','production','warehouse','finance','sales') then
    raise exception 'Érvénytelen belső szerepkör.';
  end if;
  update public.app_users
     set role=v_role,active=true,partner_id=null,
         organization_id=(select id from public.organizations where name='Gellamille')
   where lower(email)=lower(v_email);
  if not found then raise exception 'Az Auth felhasználó nincs az app_users táblában.'; end if;
end $$;
