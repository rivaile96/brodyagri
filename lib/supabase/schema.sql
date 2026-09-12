-- Plants table
create table plants (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  variety_name text not null,
  crop_name text not null,
  category text not null,
  location_type text not null,
  planted_at date not null,
  current_week integer default 1 not null,
  status text default 'active' not null,
  cover_photo_url text,
  created_at timestamptz default now() not null
);

-- Weekly tasks
create table weekly_tasks (
  id uuid default gen_random_uuid() primary key,
  plant_id uuid references plants(id) on delete cascade not null,
  week_number integer not null,
  task text not null,
  is_done boolean default false not null,
  done_at timestamptz,
  created_at timestamptz default now() not null
);

-- Weekly analyses (AI results)
create table weekly_analyses (
  id uuid default gen_random_uuid() primary key,
  plant_id uuid references plants(id) on delete cascade not null,
  week_number integer not null,
  photo_url text,
  ai_summary text,
  tasks_for_next_week jsonb default '[]'::jsonb,
  created_at timestamptz default now() not null
);

-- AI settings per user
create table ai_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  provider text default 'openai' not null,
  api_key_encrypted text,
  model text default 'gpt-4o-mini' not null,
  custom_endpoint text,
  is_active boolean default false not null,
  updated_at timestamptz default now() not null
);

-- Storage bucket for plant photos
insert into storage.buckets (id, name, public) values ('plant-photos', 'plant-photos', true);

-- RLS policies
alter table plants enable row level security;
alter table weekly_tasks enable row level security;
alter table weekly_analyses enable row level security;
alter table ai_settings enable row level security;

create policy "Users own their plants" on plants
  for all using (auth.uid() = user_id);

create policy "Users own their tasks via plant" on weekly_tasks
  for all using (
    exists (select 1 from plants where plants.id = weekly_tasks.plant_id and plants.user_id = auth.uid())
  );

create policy "Users own their analyses via plant" on weekly_analyses
  for all using (
    exists (select 1 from plants where plants.id = weekly_analyses.plant_id and plants.user_id = auth.uid())
  );

create policy "Users own their AI settings" on ai_settings
  for all using (auth.uid() = user_id);

-- Storage policy
create policy "Users can upload their own plant photos" on storage.objects
  for insert with check (bucket_id = 'plant-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Plant photos are publicly readable" on storage.objects
  for select using (bucket_id = 'plant-photos');
