-- SwiftDrop rider support. Run AFTER supabase-schema.sql. Safe to re-run.
-- Supabase dashboard -> SQL Editor -> paste -> Run.

-- 1) Rider columns on orders.
alter table public.orders add column if not exists rider_id   uuid references auth.users (id) on delete set null;
alter table public.orders add column if not exists rider_name text;

-- 2) Riders can CLAIM an open job, or update a job they are delivering.
--    WITH CHECK guarantees they can only assign the job to themselves.
drop policy if exists "orders rider update" on public.orders;
create policy "orders rider update" on public.orders for update
  using ((rider_id is null and status = 'Finding a rider') or rider_id = auth.uid())
  with check (rider_id = auth.uid());

-- 3) SECURITY: riders must NOT be able to read other customers' rows directly,
--    because that would expose the delivery code (pin). Remove any such policy
--    and expose only safe columns through a view instead.
drop policy if exists "orders read as rider" on public.orders;

-- The view runs with its owner's rights (bypasses table RLS) but only selects
-- non-sensitive columns (no pin, no customer id) and its WHERE clause limits rows
-- to open jobs + the requesting rider's own jobs.
create or replace view public.rider_jobs as
  select id, type, title, subtitle, total, status, rider_id, created_at
  from public.orders
  where (rider_id is null and status = 'Finding a rider') or rider_id = auth.uid();

grant select on public.rider_jobs to authenticated;

-- 4) Secure completion: the customer's delivery code is checked in the database,
--    so the rider never needs to (and cannot) read it. Marks delivered on a match.
create or replace function public.complete_delivery(p_order_id uuid, p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare affected int;
begin
  update public.orders
     set status = 'Delivered'
   where id = p_order_id
     and rider_id = auth.uid()
     and pin = p_code
     and status <> 'Delivered';
  get diagnostics affected = row_count;
  return affected > 0;
end;
$$;

revoke all on function public.complete_delivery(uuid, text) from public;
grant execute on function public.complete_delivery(uuid, text) to authenticated;
