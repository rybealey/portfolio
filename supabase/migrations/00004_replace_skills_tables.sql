-- Drop old skills and skill_categories tables
drop policy if exists "Public read" on skills;
drop policy if exists "Public read" on skill_categories;
drop table if exists skills;
drop table if exists skill_categories;

-- Recreated skills table
create table skills (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  skill text not null,
  sort_order int not null default 0
);

create index idx_skills_sort on skills(sort_order);

alter table skills enable row level security;
create policy "Public read" on skills for select using (true);
