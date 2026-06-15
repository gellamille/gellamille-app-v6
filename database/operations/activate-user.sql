-- Biztonságos sablon belső felhasználó aktiválásához.
-- 1. Supabase Dashboard > Authentication > Users alatt másold ki a user UUID-t.
-- 2. Cseréld ki az alábbi UUID-t.
-- 3. Adminhoz role='admin', operatív felhasználóhoz role='staff'.

update public.app_users
set
  active = true,
  role = 'staff',
  partner_id = null,
  updated_at = now()
where user_id = '00000000-0000-0000-0000-000000000000'::uuid;

select user_id, email, display_name, role, active
from public.app_users
where user_id = '00000000-0000-0000-0000-000000000000'::uuid;
