-- GELLAMILLE V6 – Partneri fiók aktiválása
--
-- 1. Előbb hozd létre a felhasználót:
--    Supabase → Authentication → Users.
-- 2. Az alábbi blokkban csak a v_email és v_partner_id értékét írd át.
-- 3. Futtasd a Supabase SQL Editorban.
--
-- A művelet nem hoz létre Auth-fiókot. A meglévő Auth-fiókot kapcsolja
-- egy aktív partnerhez, és engedélyezi a partneri rendelési felületet.

do $$
declare
  v_email text := 'partner@example.com'; -- ÍRD ÁT
  v_partner_id bigint := 1;              -- ÍRD ÁT
  v_user_id uuid;
  v_partner_name text;
begin
  select id
  into strict v_user_id
  from auth.users
  where lower(email) = lower(v_email);

  select name
  into strict v_partner_name
  from public.partners
  where id = v_partner_id
    and active = true;

  insert into public.app_users (
    user_id,
    email,
    display_name,
    role,
    partner_id,
    active
  )
  values (
    v_user_id,
    lower(v_email),
    v_partner_name,
    'partner',
    v_partner_id,
    true
  )
  on conflict (user_id) do update
  set
    email = excluded.email,
    display_name = excluded.display_name,
    role = excluded.role,
    partner_id = excluded.partner_id,
    active = true,
    updated_at = now();

  insert into public.audit_log (
    actor_user_id,
    action,
    entity_type,
    entity_id,
    after_data
  )
  values (
    null,
    'partner_user.activated_from_sql_editor',
    'app_user',
    v_user_id::text,
    jsonb_build_object(
      'email', lower(v_email),
      'partner_id', v_partner_id,
      'partner_name', v_partner_name,
      'role', 'partner',
      'active', true
    )
  );

  raise notice 'Partneri fiók aktiválva: % → % (ID: %)',
    lower(v_email), v_partner_name, v_partner_id;
exception
  when no_data_found then
    raise exception
      'Nem található az Auth-fiók vagy az aktív partner. Email: %, partner ID: %',
      v_email, v_partner_id;
  when too_many_rows then
    raise exception
      'Az email címhez több Auth-fiók tartozik: %', v_email;
end;
$$;
