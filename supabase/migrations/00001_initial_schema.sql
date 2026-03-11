-- Arenaspot initial schema

-- Profiles table (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text not null,
  avatar_url text,
  bio text,
  city text,
  age integer,
  weight_class text,
  fight_style text,
  record_w integer not null default 0,
  record_l integer not null default 0,
  record_d integer not null default 0,
  is_verified boolean not null default false,
  followers_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- Videos table
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references public.profiles(id) on delete cascade not null,
  cloudflare_video_id text not null,
  title text not null,
  duration integer,
  created_at timestamptz not null default now()
);

-- Follows table
create table public.follows (
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id)
);

-- Indexes
create index idx_profiles_username on public.profiles(username);
create index idx_videos_athlete_id on public.videos(athlete_id);
create index idx_follows_following_id on public.follows(following_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.videos enable row level security;
alter table public.follows enable row level security;

-- Profiles: anyone can read, only owner can update
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Videos: anyone can read, only owner can insert/delete
create policy "Videos are viewable by everyone"
  on public.videos for select
  using (true);

create policy "Athletes can insert own videos"
  on public.videos for insert
  with check (auth.uid() = athlete_id);

create policy "Athletes can delete own videos"
  on public.videos for delete
  using (auth.uid() = athlete_id);

-- Follows: anyone can read, authenticated users can follow/unfollow
create policy "Follows are viewable by everyone"
  on public.follows for select
  using (true);

create policy "Authenticated users can follow"
  on public.follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on public.follows for delete
  using (auth.uid() = follower_id);
