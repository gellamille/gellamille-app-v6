begin;

create extension if not exists pgcrypto;

alter table public.app_users
  add column if not exists password_change_required boolean not null default false,
  add column if not exists temporary_password_hash text,
  add column if not exists temporary_password_set_at timestamptz,
  add column if not exists temporary_password_expires_at timestamptz,
  add column if not exists password_changed_at timestamptz;

commit;
