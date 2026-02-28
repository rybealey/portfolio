-- ============================================================================
-- Portfolio Database Schema
-- Single consolidated migration for the full database setup.
-- ============================================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 1. PROFILE
-- ============================================================================
create table if not exists profile (
  id          uuid primary key default uuid_generate_v4(),
  first_name  text not null,
  last_name   text not null,
  looking_for_work boolean not null default true,
  about       text,
  years_exp   int not null default 0,
  project_count int not null default 0,
  client_count  int not null default 0,
  updated_at  timestamptz not null default now()
);

alter table profile enable row level security;

create policy "Public read access"
  on profile for select using (true);

create policy "Authenticated update access"
  on profile for update to authenticated using (true) with check (true);

-- ============================================================================
-- 2. SKILLS
-- ============================================================================
create table if not exists skills (
  id         uuid primary key default uuid_generate_v4(),
  type       text not null,
  skill      text not null,
  sort_order int not null default 0
);

create index idx_skills_sort on skills (sort_order);

alter table skills enable row level security;

create policy "Public read access"
  on skills for select using (true);

create policy "Authenticated insert access"
  on skills for insert to authenticated with check (true);

create policy "Authenticated delete access"
  on skills for delete to authenticated using (true);

-- ============================================================================
-- 3. PROJECTS
-- ============================================================================
create table if not exists projects (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  type            text not null,
  excerpt         text not null default '',
  description     text not null default '',
  slug            text not null unique,
  status          text not null default 'draft',
  date_completed  timestamptz not null default now(),
  role            text not null default '',
  timeline        text not null default '',
  tools           text not null default '',
  team            int not null default 1,
  cover_image     text,
  gallery_images  text[] not null default '{}',
  website         text,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now()
);

create index idx_projects_slug on projects (slug);
create index idx_projects_sort on projects (sort_order);

alter table projects enable row level security;

create policy "Public read access"
  on projects for select using (true);

create policy "Authenticated insert access"
  on projects for insert to authenticated with check (true);

create policy "Authenticated update access"
  on projects for update to authenticated using (true) with check (true);

create policy "Authenticated delete access"
  on projects for delete to authenticated using (true);

-- ============================================================================
-- 4. WORK HISTORY
-- ============================================================================
create table if not exists work_history (
  id              uuid primary key default uuid_generate_v4(),
  job_title       text not null,
  job_description text not null default '',
  employer        text not null,
  start_date      date not null,
  end_date        date,
  sort_order      int not null default 0
);

create index idx_work_history_sort on work_history (sort_order);

alter table work_history enable row level security;

create policy "Public read access"
  on work_history for select using (true);

create policy "Authenticated insert access"
  on work_history for insert to authenticated with check (true);

create policy "Authenticated update access"
  on work_history for update to authenticated using (true) with check (true);

create policy "Authenticated delete access"
  on work_history for delete to authenticated using (true);

-- ============================================================================
-- 5. SOCIALS
-- ============================================================================
create table if not exists socials (
  id         uuid primary key default uuid_generate_v4(),
  platform   text not null,
  url        text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_socials_sort on socials (sort_order);

alter table socials enable row level security;

create policy "Public read access"
  on socials for select using (true);

create policy "Authenticated insert access"
  on socials for insert to authenticated with check (true);

create policy "Authenticated update access"
  on socials for update to authenticated using (true) with check (true);

create policy "Authenticated delete access"
  on socials for delete to authenticated using (true);

-- ============================================================================
-- 6. STORAGE — Project Media Bucket
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('project-media', 'project-media', true)
on conflict (id) do nothing;

create policy "Public read access"
  on storage.objects for select
  using (bucket_id = 'project-media');

create policy "Authenticated upload access"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'project-media');

create policy "Authenticated delete access"
  on storage.objects for delete to authenticated
  using (bucket_id = 'project-media');
