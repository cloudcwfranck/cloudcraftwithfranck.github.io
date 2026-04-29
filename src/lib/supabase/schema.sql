create table profiles (
  id uuid references auth.users primary key,
  email text,
  full_name text,
  role text default 'student',
  total_xp integer default 0,
  cert_level text,
  created_at timestamptz default now()
);

create table tracks (
  id text primary key,
  name text not null,
  icon text,
  color text,
  accent text,
  description text,
  order_index integer
);

create table assignments (
  id text primary key,
  track_id text references tracks(id),
  title text not null,
  level text,
  xp integer default 200,
  type text,
  lang text,
  description text,
  rubric jsonb,
  placeholder text,
  order_index integer
);

create table submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  assignment_id text references assignments(id),
  content text,
  file_path text,
  score integer,
  grade text,
  rubric_scores jsonb,
  strengths jsonb,
  gaps jsonb,
  security_findings jsonb,
  recommendation text,
  cert_ready boolean default false,
  xp_earned integer default 0,
  created_at timestamptz default now()
);

create table certifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  level text,
  cert_number text unique,
  issued_at timestamptz default now()
);

alter table profiles enable row level security;
alter table submissions enable row level security;
alter table certifications enable row level security;
create policy "Own profile" on profiles for all using (auth.uid() = id);
create policy "Own submissions" on submissions for all using (auth.uid() = user_id);
create policy "Own certs" on certifications for all using (auth.uid() = user_id);
create policy "Tracks public" on tracks for select using (true);
create policy "Assignments public" on assignments for select using (true);
