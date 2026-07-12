-- Enable UUID extension if not present
create extension if not exists "uuid-ossp";

-- 1. COACHING APPLICATIONS TABLE
create table if not exists public.applications (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    full_name text not null,
    email text not null,
    phone text not null,
    athlete_age integer not null,
    primary_goal text not null,
    current_times text,
    status text default 'new'::text check (status in ('new', 'contacted', 'accepted', 'archived')),
    notes text
);

-- 2. LEAD CAPTURE TABLE (RESOURCE DOWNLOADS)
create table if not exists public.leads (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    email text not null unique,
    resource_slug text not null,
    delivered_status boolean default false
);

-- 3. INTERACTION & VISIT TRACKING LOG (CRM FEED)
create table if not exists public.visit_logs (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    page_path text not null,
    referrer text,
    ip_hashed text, -- Privacy-friendly analytics
    user_agent text
);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.applications enable row level security;
alter table public.leads enable row level security;
alter table public.visit_logs enable row level security;

-- 5. CREATE POLICY RULES
drop policy if exists "Allow public form anonymous inserts" on public.applications;
drop policy if exists "Allow public lead subscriptions" on public.leads;
drop policy if exists "Allow public tracking logs" on public.visit_logs;
drop policy if exists "Restrict application reads to Admins" on public.applications;
drop policy if exists "Restrict lead reads to Admins" on public.leads;
drop policy if exists "Restrict visit analytics to Admins" on public.visit_logs;

-- Public: Allow inserts to public tables for user submissions, deny reads.
create policy "Allow public form anonymous inserts" on public.applications 
    for insert with check (true);

create policy "Allow public lead subscriptions" on public.leads 
    for insert with check (true);

create policy "Allow public tracking logs" on public.visit_logs 
    for insert with check (true);

-- Admin Boundaries: Only authenticated users can manage, read or modify records.
create policy "Restrict application reads to Admins" on public.applications 
    for all using (auth.role() = 'authenticated');

create policy "Restrict lead reads to Admins" on public.leads 
    for all using (auth.role() = 'authenticated');

create policy "Restrict visit analytics to Admins" on public.visit_logs 
    for all using (auth.role() = 'authenticated');

-- ==============================================================================
-- 6. RESOURCES (Dynamic Management)
-- ==============================================================================
create table if not exists public.resources (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    slug text not null unique,
    description text not null,
    type text not null check (type in ('free', 'paid')),
    price numeric,
    file_url text
);

alter table public.resources enable row level security;

drop policy if exists "Public can view resources" on public.resources;
drop policy if exists "Admins can manage resources" on public.resources;

create policy "Public can view resources" on public.resources 
    for select to public using (true);

create policy "Admins can manage resources" on public.resources 
    for all to authenticated using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ==============================================================================
-- 7. PROFILES & USER AUTHENTICATION
-- ==============================================================================
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    full_name text,
    avatar_url text,
    role text default 'client'::text check (role in ('admin', 'client'))
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles 
    for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles 
    for update using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles 
    for select using (auth.role() = 'authenticated');

-- Trigger to create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create a profile for every user signed up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- 8. USER ASSETS (Subscriptions & Granted Resources)
-- ==============================================================================
create table if not exists public.user_assets (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    asset_type text not null check (asset_type in ('subscription', 'resource')),
    asset_name text not null, -- Name of the sub or resource
    resource_id uuid references public.resources(id) on delete cascade, -- Optional, if it's a specific resource
    status text default 'active'::text check (status in ('active', 'expired', 'cancelled')),
    expires_at timestamp with time zone
);

alter table public.user_assets enable row level security;

create policy "Users can view own assets" on public.user_assets 
    for select using (auth.uid() = user_id);

create policy "Admins can manage user assets" on public.user_assets 
    for all using (auth.role() = 'authenticated');

-- ==============================================================================
-- 9. SUPABASE STORAGE BUCKET (RESOURCES)
-- ==============================================================================
-- You must manually create a storage bucket named "resources" and make it public.
-- If running via SQL, you can execute the following (if storage schema exists):

-- insert into storage.buckets (id, name, public) values ('resources', 'resources', true);
-- 
-- create policy "Public Access to Resources" on storage.objects 
--     for select using (bucket_id = 'resources');
-- 
-- create policy "Admins can upload resources" on storage.objects 
--     for insert with check (bucket_id = 'resources' and auth.role() = 'authenticated');
