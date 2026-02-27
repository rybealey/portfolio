-- ============================================================
-- Portfolio database schema
-- ============================================================

-- 1. Profile: single-row table for hero, about, and contact content
create table profile (
  id uuid primary key default gen_random_uuid(),
  -- Hero
  status_text text not null default 'available_for_work',
  title_line1 text not null,
  title_line2 text not null,
  subtitle text not null,
  description text not null,
  -- About
  about_heading text not null default 'A bit about me',
  portrait_url text,
  bio text[] not null default '{}',
  -- Contact
  contact_heading text not null default 'Let''s work together',
  contact_subtitle text not null,
  email text not null,
  -- Timestamps
  updated_at timestamptz not null default now()
);

-- 2. Stats: the numeric highlights shown in the About section
create table stats (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  sort_order int not null default 0
);

-- 3. Experiences: work history entries
create table experiences (
  id uuid primary key default gen_random_uuid(),
  date_range text not null,
  role text not null,
  company text not null,
  description text not null,
  url text,
  sort_order int not null default 0
);

-- 4. Skill categories + individual skills
create table skill_categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  sort_order int not null default 0
);

create table skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references skill_categories(id) on delete cascade,
  name text not null,
  sort_order int not null default 0
);

-- 5. Projects: portfolio showcase items
create table projects (
  id uuid primary key default gen_random_uuid(),
  tag text not null,
  title text not null,
  description text not null,
  image_url text,
  gradient text not null default 'from-cyan-500/20 to-blue-600/20',
  url text,
  sort_order int not null default 0
);

-- 6. Social links: footer links
create table social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  sort_order int not null default 0
);

-- ============================================================
-- Seed with current hardcoded data
-- ============================================================

insert into profile (
  status_text, title_line1, title_line2, subtitle, description,
  about_heading, bio,
  contact_heading, contact_subtitle, email
) values (
  'available_for_work',
  'Product Designer',
  '& Developer',
  'Crafting digital experiences that matter',
  'I design and build thoughtful, user-centered products that blend clean aesthetics with solid engineering. Currently focused on design systems and interactive web experiences.',
  'A bit about me',
  array[
    'I''m a product designer and developer with over 8 years of experience building digital products. I started my career in graphic design before transitioning into UI/UX, and eventually fell in love with front-end development.',
    'My sweet spot is the intersection of design and engineering — where pixel-perfect interfaces meet clean, maintainable code. I believe the best products come from understanding both sides of the equation.'
  ],
  'Let''s work together',
  'Have a project in mind or just want to chat? I''m always open to discussing new opportunities and ideas.',
  'hello@rybealey.com'
);

insert into stats (value, label, sort_order) values
  ('8+',  'Years Experience',    0),
  ('50+', 'Projects Completed',  1),
  ('30+', 'Happy Clients',       2);

insert into experiences (date_range, role, company, description, sort_order) values
  ('2022 — Present', 'Senior Product Designer', 'Stripe',
   'Leading design for the payments dashboard, improving merchant onboarding flows, and building internal design system components.', 0),
  ('2019 — 2022', 'Product Designer', 'Figma',
   'Designed core collaboration features including multiplayer cursors, commenting system, and component library management.', 1),
  ('2017 — 2019', 'UI/UX Designer', 'Spotify',
   'Worked on the mobile listening experience, playlist creation flows, and artist profile pages.', 2);

insert into skill_categories (id, title, sort_order) values
  ('a0000000-0000-0000-0000-000000000001', 'Design',      0),
  ('a0000000-0000-0000-0000-000000000002', 'Development',  1),
  ('a0000000-0000-0000-0000-000000000003', 'Tools',        2);

insert into skills (category_id, name, sort_order) values
  ('a0000000-0000-0000-0000-000000000001', 'UI/UX Design',    0),
  ('a0000000-0000-0000-0000-000000000001', 'Design Systems',  1),
  ('a0000000-0000-0000-0000-000000000001', 'Prototyping',     2),
  ('a0000000-0000-0000-0000-000000000001', 'User Research',   3),
  ('a0000000-0000-0000-0000-000000000001', 'Visual Design',   4),
  ('a0000000-0000-0000-0000-000000000002', 'React / Next.js', 0),
  ('a0000000-0000-0000-0000-000000000002', 'TypeScript',      1),
  ('a0000000-0000-0000-0000-000000000002', 'Tailwind CSS',    2),
  ('a0000000-0000-0000-0000-000000000002', 'Node.js',         3),
  ('a0000000-0000-0000-0000-000000000002', 'REST & GraphQL',  4),
  ('a0000000-0000-0000-0000-000000000003', 'Figma',           0),
  ('a0000000-0000-0000-0000-000000000003', 'VS Code',         1),
  ('a0000000-0000-0000-0000-000000000003', 'Git & GitHub',    2),
  ('a0000000-0000-0000-0000-000000000003', 'Vercel',          3),
  ('a0000000-0000-0000-0000-000000000003', 'Notion',          4);

insert into projects (tag, title, description, gradient, sort_order) values
  ('Web App',   'Pulse Analytics', 'A real-time analytics dashboard for monitoring user engagement and product metrics.',           'from-cyan-500/20 to-blue-600/20',    0),
  ('Mobile App','Mindful',         'A meditation and mindfulness app with guided sessions and progress tracking.',                  'from-emerald-500/20 to-teal-600/20', 1),
  ('Branding',  'Nomad Studio',    'Brand identity and website design for a creative agency focused on remote work.',               'from-purple-500/20 to-pink-600/20',  2),
  ('SaaS',      'Aura',            'A project management tool designed for small creative teams and freelancers.',                  'from-orange-500/20 to-red-600/20',   3);

insert into social_links (platform, url, sort_order) values
  ('GitHub',   'https://github.com',   0),
  ('LinkedIn', 'https://linkedin.com', 1),
  ('Twitter',  'https://twitter.com',  2),
  ('Dribbble', 'https://dribbble.com', 3);

-- ============================================================
-- Indexes for sort_order queries
-- ============================================================
create index idx_stats_sort        on stats(sort_order);
create index idx_experiences_sort   on experiences(sort_order);
create index idx_skill_categories_sort on skill_categories(sort_order);
create index idx_skills_category_sort  on skills(category_id, sort_order);
create index idx_projects_sort      on projects(sort_order);
create index idx_social_links_sort  on social_links(sort_order);

-- ============================================================
-- Row-level security (public read-only)
-- ============================================================
alter table profile          enable row level security;
alter table stats            enable row level security;
alter table experiences      enable row level security;
alter table skill_categories enable row level security;
alter table skills           enable row level security;
alter table projects         enable row level security;
alter table social_links     enable row level security;

create policy "Public read" on profile          for select using (true);
create policy "Public read" on stats            for select using (true);
create policy "Public read" on experiences      for select using (true);
create policy "Public read" on skill_categories for select using (true);
create policy "Public read" on skills           for select using (true);
create policy "Public read" on projects         for select using (true);
create policy "Public read" on social_links     for select using (true);
