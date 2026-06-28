begin;

alter table public.app_users
  add column if not exists temporary_password_plain text;

comment on column public.app_users.temporary_password_plain is
  'Admin-only visible temporary partner password. Cleared when the partner sets a permanent password.';

commit;
