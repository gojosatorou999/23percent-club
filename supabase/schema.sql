-- 23percent club: Supabase schema.
-- Paste this whole file into Supabase > SQL Editor > New query > Run. Safe to run again.

create table if not exists public.members (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null default '',
  city        text,
  age_band    text,
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint members_data_size check (octet_length(data::text) < 1500000)
);

alter table public.members enable row level security;

-- Each person can read and change only their own row.
drop policy if exists "members_select_own" on public.members;
drop policy if exists "members_insert_own" on public.members;
drop policy if exists "members_update_own" on public.members;
drop policy if exists "members_delete_own" on public.members;

create policy "members_select_own" on public.members for select to authenticated using (auth.uid() = id);
create policy "members_insert_own" on public.members for insert to authenticated with check (auth.uid() = id);
create policy "members_update_own" on public.members for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "members_delete_own" on public.members for delete to authenticated using (auth.uid() = id);

-- "Delete account" in Settings calls this. It removes the login and, by cascade, the saved data.
create or replace function public.delete_my_account()
returns void
language sql
security definer
set search_path = public, auth
as $$
  delete from auth.users where id = auth.uid();
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
