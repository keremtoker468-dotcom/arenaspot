-- Arenaspot initial schema

-- Custom types
create type public.user_role as enum ('athlete', 'fan', 'gym', 'pt');
create type public.conversation_type as enum ('sparring', 'job_offer', 'general');

-- Profiles table (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text not null,
  avatar_url text,
  bio text,
  city text,
  age integer,
  role public.user_role not null default 'fan',
  fight_style text,
  weight_class text,
  record_w integer not null default 0,
  record_l integer not null default 0,
  record_d integer not null default 0,
  gym_name text,
  workplace text,
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
  thumbnail_url text,
  created_at timestamptz not null default now()
);

-- Follows table
create table public.follows (
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id)
);

-- Conversations table
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  participant_1 uuid references public.profiles(id) on delete cascade not null,
  participant_2 uuid references public.profiles(id) on delete cascade not null,
  type public.conversation_type not null default 'general',
  created_at timestamptz not null default now(),
  unique (participant_1, participant_2)
);

-- Messages table
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_profiles_username on public.profiles(username);
create index idx_profiles_role on public.profiles(role);
create index idx_profiles_city on public.profiles(city);
create index idx_profiles_fight_style on public.profiles(fight_style);
create index idx_videos_athlete_id on public.videos(athlete_id);
create index idx_follows_following_id on public.follows(following_id);
create index idx_conversations_participant_1 on public.conversations(participant_1);
create index idx_conversations_participant_2 on public.conversations(participant_2);
create index idx_messages_conversation_id on public.messages(conversation_id);
create index idx_messages_created_at on public.messages(created_at);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.videos enable row level security;
alter table public.follows enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Profiles: anyone can read, only owner can update/insert
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

-- Conversations: participants can read their conversations
create policy "Users can view own conversations"
  on public.conversations for select
  using (auth.uid() = participant_1 or auth.uid() = participant_2);

create policy "Authenticated users can create conversations"
  on public.conversations for insert
  with check (auth.uid() = participant_1 or auth.uid() = participant_2);

-- Messages: participants can read messages in their conversations
create policy "Users can view messages in their conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
      and (c.participant_1 = auth.uid() or c.participant_2 = auth.uid())
    )
  );

create policy "Users can send messages in their conversations"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
      and (c.participant_1 = auth.uid() or c.participant_2 = auth.uid())
    )
  );

-- Enable realtime for messages
alter publication supabase_realtime add table public.messages;
