-- Egy partnerhez pontosan egy aktív partneri belépés kapcsolható.
-- Írd át az e-mail-címet és a partner ID-t.
do $$
declare v_email text:='CSERELD_KI_PARTNER_EMAILRE'; v_partner_id bigint:=0;
begin
 if not exists(select 1 from public.partners where id=v_partner_id and active) then
   raise exception 'A partner nem található vagy inaktív.';
 end if;
 update public.app_users
    set role='partner',partner_id=v_partner_id,active=true,
        organization_id=(select organization_id from public.partners where id=v_partner_id)
  where lower(email)=lower(v_email);
 if not found then raise exception 'Az Auth felhasználó nincs az app_users táblában.'; end if;
end $$;
