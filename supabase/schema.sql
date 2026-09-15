-- Enable UUID extension if not present
create extension if not exists "uuid-ossp";

-- 1. COACHING APPLICATIONS TABLE
create table if not exists public.applications (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    full_name text not null,
    email text not null,
    phone text not null,
    date_of_birth date,
    athlete_age integer,
    swimming_discipline text,
    swimming_level text,
    club text,
    primary_goals text,
    gym_access text,
    preferred_training_frequency text,
    form_data jsonb default '{}'::jsonb,
    status text default 'new'::text check (status in ('new', 'reviewing', 'contacted', 'call_scheduled', 'accepted', 'rejected', 'waitlist', 'client')),
    notes text
);

-- Add columns if they were created in an older schema version
DO $$ 
BEGIN
    -- Handle legacy column if it exists
    ALTER TABLE public.applications DROP COLUMN IF EXISTS primary_goal;

    -- Update check constraint
    ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_status_check;
    ALTER TABLE public.applications ADD CONSTRAINT applications_status_check CHECK (status in ('new', 'reviewing', 'contacted', 'call_scheduled', 'accepted', 'rejected', 'waitlist', 'client', 'archived'));

    BEGIN
        ALTER TABLE public.applications ALTER COLUMN primary_goals DROP NOT NULL;
    EXCEPTION
        WHEN undefined_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE public.applications ADD COLUMN date_of_birth date;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    BEGIN
        ALTER TABLE public.applications ADD COLUMN athlete_age integer;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    BEGIN
        ALTER TABLE public.applications ADD COLUMN swimming_discipline text;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    BEGIN
        ALTER TABLE public.applications ADD COLUMN swimming_level text;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    BEGIN
        ALTER TABLE public.applications ADD COLUMN club text;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    BEGIN
        ALTER TABLE public.applications ADD COLUMN primary_goals text;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    BEGIN
        ALTER TABLE public.applications ADD COLUMN gym_access text;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    BEGIN
        ALTER TABLE public.applications ADD COLUMN preferred_training_frequency text;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
END $$;

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

-- 4.5 SECURITY DEFINER FUNCTION FOR ADMIN CHECKS
-- This avoids infinite recursion in RLS policies.
create or replace function public.is_admin()
returns boolean as $$
declare
  is_adm boolean;
begin
  select (role = 'admin') into is_adm from public.profiles where id = auth.uid();
  return coalesce(is_adm, false);
end;
$$ language plpgsql security definer;

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

-- Admin Boundaries: Only authenticated users with admin role can manage, read or modify records.
create policy "Restrict application reads to Admins" on public.applications 
    for all using (public.is_admin());

create policy "Restrict lead reads to Admins" on public.leads 
    for all using (public.is_admin());

create policy "Restrict visit analytics to Admins" on public.visit_logs 
    for all using (public.is_admin());

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
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

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

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles 
    for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles 
    for update using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles 
    for select using (public.is_admin());

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
    custom_file_url text, -- Optional, if it's a bespoke uploaded plan for this client
    status text default 'active'::text check (status in ('active', 'expired', 'cancelled', 'pending_payment')),
    expires_at timestamp with time zone
);

alter table public.user_assets enable row level security;

drop policy if exists "Users can view own assets" on public.user_assets;
create policy "Users can view own assets" on public.user_assets 
    for select using (auth.uid() = user_id);

drop policy if exists "Admins can manage user assets" on public.user_assets;
create policy "Admins can manage user assets" on public.user_assets 
    for all using (public.is_admin());

-- ==============================================================================
-- 9. SUPABASE STORAGE BUCKETS (RESOURCES, VIDEOS, RESULTS)
-- ==============================================================================
-- Automatically create the required buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('resources', 'resources', true),
  ('results', 'results', true),
  ('client_videos', 'client_videos', false)
ON CONFLICT (id) DO NOTHING;

-- Drop old policies if they exist (to allow idempotency)
DROP POLICY IF EXISTS "Public Access to Resources" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload resources" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage resources" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to Results" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage results" ON storage.objects;

-- Create Policies for Resources Bucket
CREATE POLICY "Public Access to Resources" ON storage.objects FOR SELECT USING (bucket_id = 'resources');
CREATE POLICY "Admins can manage resources" ON storage.objects FOR ALL USING (bucket_id = 'resources' AND public.is_admin());

-- Create Policies for Results Bucket
CREATE POLICY "Public Access to Results" ON storage.objects FOR SELECT USING (bucket_id = 'results');
CREATE POLICY "Admins can manage results" ON storage.objects FOR ALL USING (bucket_id = 'results' AND public.is_admin());

-- ==============================================================================
-- 10. COACHING: WORKOUTS & TRAINING LOGS
-- ==============================================================================
create table if not exists public.workouts (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    description text,
    exercises jsonb default '[]'::jsonb, -- Array of objects: { name, sets, reps, distance, rest, notes }
    created_by uuid references auth.users(id) on delete set null
);

create table if not exists public.workout_sessions (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    client_id uuid references auth.users(id) on delete cascade not null,
    workout_id uuid references public.workouts(id) on delete cascade not null,
    scheduled_date date not null,
    completed boolean default false,
    completed_at timestamp with time zone,
    client_notes text,
    rpe integer check (rpe >= 1 and rpe <= 10), -- Rate of Perceived Exertion
    coach_feedback text
);

alter table public.workouts enable row level security;
alter table public.workout_sessions enable row level security;

drop policy if exists "Admins can manage workouts" on public.workouts;
create policy "Admins can manage workouts" on public.workouts for all using (public.is_admin());

drop policy if exists "Clients can view their sessions" on public.workout_sessions;
create policy "Clients can view their sessions" on public.workout_sessions for select using (auth.uid() = client_id);

drop policy if exists "Clients can update their sessions" on public.workout_sessions;
create policy "Clients can update their sessions" on public.workout_sessions for update using (auth.uid() = client_id);

drop policy if exists "Admins can manage sessions" on public.workout_sessions;
create policy "Admins can manage sessions" on public.workout_sessions for all using (public.is_admin());

-- ==============================================================================
-- 11. COACHING: TECHNIQUE ANALYSIS (VIDEOS)
-- ==============================================================================
create table if not exists public.technique_videos (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    client_id uuid references auth.users(id) on delete cascade not null,
    video_url text not null,
    stroke_type text, -- freestyle, backstroke, breaststroke, butterfly, start, turn
    client_comment text,
    coach_feedback text,
    status text default 'pending_review'::text check (status in ('pending_review', 'reviewed'))
);

alter table public.technique_videos enable row level security;

drop policy if exists "Clients can view own videos" on public.technique_videos;
create policy "Clients can view own videos" on public.technique_videos for select using (auth.uid() = client_id);

drop policy if exists "Clients can insert own videos" on public.technique_videos;
create policy "Clients can insert own videos" on public.technique_videos for insert with check (auth.uid() = client_id);

drop policy if exists "Admins can manage videos" on public.technique_videos;
create policy "Admins can manage videos" on public.technique_videos for all using (public.is_admin());

-- ==============================================================================
-- 12. COACHING: PERSONAL BESTS
-- ==============================================================================
create table if not exists public.personal_bests (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    client_id uuid references auth.users(id) on delete cascade not null,
    event text not null, -- e.g. "50m Freestyle LC"
    time_seconds numeric not null,
    achieved_date date not null,
    competition_name text,
    pool_type text check (pool_type in ('LCM', 'SCM', 'SCY'))
);

alter table public.personal_bests enable row level security;

drop policy if exists "Clients can view own PBs" on public.personal_bests;
create policy "Clients can view own PBs" on public.personal_bests for select using (auth.uid() = client_id);

drop policy if exists "Clients can insert own PBs" on public.personal_bests;
create policy "Clients can insert own PBs" on public.personal_bests for insert with check (auth.uid() = client_id);

drop policy if exists "Clients can update own PBs" on public.personal_bests;
create policy "Clients can update own PBs" on public.personal_bests for update using (auth.uid() = client_id);

drop policy if exists "Clients can delete own PBs" on public.personal_bests;
create policy "Clients can delete own PBs" on public.personal_bests for delete using (auth.uid() = client_id);

drop policy if exists "Admins can view PBs" on public.personal_bests;
create policy "Admins can view PBs" on public.personal_bests for select using (public.is_admin());

drop policy if exists "Admins can manage PBs" on public.personal_bests;
create policy "Admins can manage PBs" on public.personal_bests for all using (public.is_admin());

-- ==============================================================================
-- 13. COACHING: DIRECT MESSAGES
-- ==============================================================================
create table if not exists public.messages (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    sender_id uuid references auth.users(id) on delete cascade not null,
    receiver_id uuid references auth.users(id) on delete cascade not null,
    content text not null,
    is_read boolean default false
);

alter table public.messages enable row level security;

drop policy if exists "Users can read own messages" on public.messages;
create policy "Users can read own messages" on public.messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "Users can send messages" on public.messages;
create policy "Users can send messages" on public.messages for insert with check (auth.uid() = sender_id);

drop policy if exists "Admins can read all messages (for audit)" on public.messages;
create policy "Admins can read all messages (for audit)" on public.messages for select using (public.is_admin());

-- ==============================================================================
-- 14. CMS: LANDING PAGE CONTENT & RESULTS
-- ==============================================================================
create table if not exists public.site_settings (
    id uuid default gen_random_uuid() primary key,
    section_key text not null unique,
    content jsonb not null default '{}'::jsonb,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.client_results (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    client_name text not null,
    achievement text not null,
    image_url text not null,
    display_order integer default 0
);

alter table public.site_settings enable row level security;
alter table public.client_results enable row level security;

drop policy if exists "Public can view site settings" on public.site_settings;
create policy "Public can view site settings" on public.site_settings for select using (true);

drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings" on public.site_settings for all using (public.is_admin());

drop policy if exists "Public can view client results" on public.client_results;
create policy "Public can view client results" on public.client_results for select using (true);

drop policy if exists "Admins can manage client results" on public.client_results;
create policy "Admins can manage client results" on public.client_results for all using (public.is_admin());
