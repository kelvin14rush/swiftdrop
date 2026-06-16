-- SwiftDrop database schema. Run this in your Supabase project:
-- Supabase dashboard -> SQL Editor -> paste -> Run.
-- Row Level Security ensures each user can only read/write their own rows.

-- ---------- Profiles (one row per user) ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text,
  phone      text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles read own"   on public.profiles;
drop policy if exists "profiles insert own" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;

create policy "profiles read own"   on public.profiles for select using (auth.uid() = id);
create policy "profiles insert own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);

-- ---------- Orders ----------
create table if not exists public.orders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  type       text not null check (type in ('package', 'buy')),
  title      text not null,
  subtitle   text not null,
  total      numeric not null default 0,
  status     text not null default 'Finding a rider',
  pin        text not null,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "orders read own"   on public.orders;
drop policy if exists "orders insert own" on public.orders;
drop policy if exists "orders update own" on public.orders;

create policy "orders read own"   on public.orders for select using (auth.uid() = user_id);
create policy "orders insert own" on public.orders for insert with check (auth.uid() = user_id);
create policy "orders update own" on public.orders for update using (auth.uid() = user_id);

create index if not exists orders_user_created_idx on public.orders (user_id, created_at desc);
