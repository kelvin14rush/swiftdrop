-- SwiftDrop rider support. Run AFTER supabase-schema.sql.
-- Supabase dashboard -> SQL Editor -> paste -> Run.

-- 1) Add rider columns to orders.
alter table public.orders add column if not exists rider_id   uuid references auth.users (id) on delete set null;
alter table public.orders add column if not exists rider_name text;

-- 2) Riders can SEE open (unclaimed) jobs and jobs they're delivering.
--    (Customers still see their own orders via the existing policy.)
drop policy if exists "orders read as rider" on public.orders;
create policy "orders read as rider" on public.orders for select
  using ((rider_id is null and status = 'Finding a rider') or rider_id = auth.uid());

-- 3) Riders can CLAIM an open job, or update a job they're delivering.
--    The WITH CHECK guarantees they can only assign the job to themselves.
drop policy if exists "orders rider update" on public.orders;
create policy "orders rider update" on public.orders for update
  using ((rider_id is null and status = 'Finding a rider') or rider_id = auth.uid())
  with check (rider_id = auth.uid());

-- 4) Secure completion: the customer's delivery code is checked in the database,
--    so it's verified even though the rider should never type a guessed code.
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
