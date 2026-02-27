-- Drop old profile table and its RLS policy
drop policy if exists "Public read" on profile;
drop table if exists profile;

-- Recreated profile table
create table profile (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  looking_for_work boolean not null default true,
  about text,
  years_exp int not null,
  project_count int not null,
  client_count int not null,
  updated_at timestamptz not null default now()
);

-- Row-level security (public read-only)
alter table profile enable row level security;
create policy "Public read" on profile for select using (true);
