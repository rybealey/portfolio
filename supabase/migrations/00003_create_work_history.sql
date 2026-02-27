create table work_history (
  id uuid primary key default gen_random_uuid(),
  job_title text not null,
  job_description text not null,
  employer text not null,
  start_date date not null,
  end_date date,
  sort_order int not null default 0
);

create index idx_work_history_sort on work_history(sort_order);

alter table work_history enable row level security;
create policy "Public read" on work_history for select using (true);
