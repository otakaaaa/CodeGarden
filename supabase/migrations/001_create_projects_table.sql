-- Enable RLS
alter table if exists projects disable row level security;
drop table if exists projects;

-- Create projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  data jsonb not null default '{
    "nodes": [],
    "edges": [],
    "settings": {
      "theme": "light",
      "previewMode": false,
      "variables": {}
    }
  }'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_deleted boolean default false not null
);

-- Enable RLS
alter table projects enable row level security;

-- Create policies
create policy "Users can view their own projects" on projects
  for select using (auth.uid() = user_id);

create policy "Users can insert their own projects" on projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects" on projects
  for update using (auth.uid() = user_id);

create policy "Users can delete their own projects" on projects
  for delete using (auth.uid() = user_id);

-- Create indexes
create index projects_user_id_idx on projects(user_id);
create index projects_updated_at_idx on projects(updated_at desc);
create index projects_is_deleted_idx on projects(is_deleted);

-- Create function to update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger update_projects_updated_at
  before update on projects
  for each row
  execute function update_updated_at_column();