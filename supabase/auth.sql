-- Auth + approval workflow (run after auth is enabled in Supabase)
-- Run this in the Supabase SQL editor AFTER running supabase/schema.sql.

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

-- Note: profiles are created on first login by the app (so RLS stays strict).

-- Helper trigger to keep updated_at current
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add approval + ownership columns (safe to re-run)
alter table public.businesses
  add column if not exists user_id uuid references auth.users (id) on delete set null,
  add column if not exists approval_status text not null default 'pending' check (approval_status in ('pending','approved','rejected')),
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references auth.users (id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

alter table public.cultural_clubs
  add column if not exists user_id uuid references auth.users (id) on delete set null,
  add column if not exists approval_status text not null default 'pending' check (approval_status in ('pending','approved','rejected')),
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references auth.users (id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

alter table public.sport_clubs
  add column if not exists user_id uuid references auth.users (id) on delete set null,
  add column if not exists approval_status text not null default 'pending' check (approval_status in ('pending','approved','rejected')),
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references auth.users (id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists trg_businesses_updated_at on public.businesses;
create trigger trg_businesses_updated_at before update on public.businesses
for each row execute function public.touch_updated_at();

drop trigger if exists trg_cultural_clubs_updated_at on public.cultural_clubs;
create trigger trg_cultural_clubs_updated_at before update on public.cultural_clubs
for each row execute function public.touch_updated_at();

drop trigger if exists trg_sport_clubs_updated_at on public.sport_clubs;
create trigger trg_sport_clubs_updated_at before update on public.sport_clubs
for each row execute function public.touch_updated_at();

-- RLS: businesses
alter table public.businesses enable row level security;
drop policy if exists "businesses_public_read_approved" on public.businesses;
create policy "businesses_public_read_approved"
on public.businesses for select
using (approval_status = 'approved');

drop policy if exists "businesses_read_own" on public.businesses;
create policy "businesses_read_own"
on public.businesses for select
using (auth.uid() is not null and user_id = auth.uid());

drop policy if exists "businesses_insert_own" on public.businesses;
create policy "businesses_insert_own"
on public.businesses for insert
with check (auth.uid() is not null and user_id = auth.uid() and approval_status = 'pending');

drop policy if exists "businesses_update_own" on public.businesses;
create policy "businesses_update_own"
on public.businesses for update
using (auth.uid() is not null and user_id = auth.uid())
with check (auth.uid() is not null and user_id = auth.uid() and approval_status = 'pending');

drop policy if exists "businesses_admin_all" on public.businesses;
create policy "businesses_admin_all"
on public.businesses for all
using (public.is_admin())
with check (public.is_admin());

-- RLS: cultural_clubs
alter table public.cultural_clubs enable row level security;
drop policy if exists "cultural_public_read_approved" on public.cultural_clubs;
create policy "cultural_public_read_approved"
on public.cultural_clubs for select
using (approval_status = 'approved');

drop policy if exists "cultural_read_own" on public.cultural_clubs;
create policy "cultural_read_own"
on public.cultural_clubs for select
using (auth.uid() is not null and user_id = auth.uid());

drop policy if exists "cultural_insert_own" on public.cultural_clubs;
create policy "cultural_insert_own"
on public.cultural_clubs for insert
with check (auth.uid() is not null and user_id = auth.uid() and approval_status = 'pending');

drop policy if exists "cultural_update_own" on public.cultural_clubs;
create policy "cultural_update_own"
on public.cultural_clubs for update
using (auth.uid() is not null and user_id = auth.uid())
with check (auth.uid() is not null and user_id = auth.uid() and approval_status = 'pending');

drop policy if exists "cultural_admin_all" on public.cultural_clubs;
create policy "cultural_admin_all"
on public.cultural_clubs for all
using (public.is_admin())
with check (public.is_admin());

-- RLS: sport_clubs
alter table public.sport_clubs enable row level security;
drop policy if exists "sport_public_read_approved" on public.sport_clubs;
create policy "sport_public_read_approved"
on public.sport_clubs for select
using (approval_status = 'approved');

drop policy if exists "sport_read_own" on public.sport_clubs;
create policy "sport_read_own"
on public.sport_clubs for select
using (auth.uid() is not null and user_id = auth.uid());

drop policy if exists "sport_insert_own" on public.sport_clubs;
create policy "sport_insert_own"
on public.sport_clubs for insert
with check (auth.uid() is not null and user_id = auth.uid() and approval_status = 'pending');

drop policy if exists "sport_update_own" on public.sport_clubs;
create policy "sport_update_own"
on public.sport_clubs for update
using (auth.uid() is not null and user_id = auth.uid())
with check (auth.uid() is not null and user_id = auth.uid() and approval_status = 'pending');

drop policy if exists "sport_admin_all" on public.sport_clubs;
create policy "sport_admin_all"
on public.sport_clubs for all
using (public.is_admin())
with check (public.is_admin());

-- Profiles policies
drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own"
on public.profiles for select
using (auth.uid() is not null and id = auth.uid());

drop policy if exists "profiles_upsert_own" on public.profiles;
create policy "profiles_upsert_own"
on public.profiles for insert
with check (auth.uid() is not null and id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() is not null and id = auth.uid())
with check (auth.uid() is not null and id = auth.uid() and role = 'user');

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all"
on public.profiles for all
using (public.is_admin())
with check (public.is_admin());
