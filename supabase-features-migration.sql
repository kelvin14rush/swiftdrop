-- SwiftDrop: ratings, real-time, and admin. Run AFTER the other migrations.
-- Supabase dashboard -> SQL Editor -> paste -> Run. Safe to re-run.

-- ============ 1) Ratings & reviews ============
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders (id) on delete cascade,
  rider_id    uuid references auth.users (id) on delete set null,
  customer_id uuid not null references auth.users (id) on delete cascade,
  stars       int not null check (stars between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now(),
  unique (order_id, customer_id)
);

alter table public.reviews enable row level security;

drop policy if exists "reviews insert own" on public.reviews;
create policy "reviews insert own" on public.reviews for insert with check (customer_id = auth.uid());

drop policy if exists "reviews read own or about me" on public.reviews;
create policy "reviews read own or about me" on public.reviews for select
  using (customer_id = auth.uid() or rider_id = auth.uid());

-- ============ 2) Real-time order status ============
-- Lets customers receive live status changes for their orders (RLS still applies).
do $$
begin
  alter publication supabase_realtime add table public.orders;
exception
  when duplicate_object then null;
end $$;

-- ============ 3) Admin ============
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

grant execute on function public.is_admin() to authenticated;

-- Admins see every order through this view (returns nothing for non-admins).
create or replace view public.admin_orders as
  select id, type, title, subtitle, total, status, rider_name, created_at
  from public.orders
  where public.is_admin();

grant select on public.admin_orders to authenticated;

-- To make yourself an admin, run (replace with your auth user id):
--   insert into public.admins (user_id) values ('YOUR-USER-UUID');
-- Find your id in Authentication -> Users, or: select auth.uid();
