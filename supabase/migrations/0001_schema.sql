-- Pulse schema. Run in order via `supabase db push` or the SQL editor.

create table users (
  id uuid primary key references auth.users,
  username text unique not null,
  avatar_url text,
  vibe_tags text[] default '{}',
  home_neighborhood text,
  is_public bool default true,
  created_at timestamptz default now()
);

create table friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  friend_id uuid references users(id) on delete cascade,
  status text check (status in ('pending','accepted')),
  created_at timestamptz default now(),
  unique(user_id, friend_id)
);

create table venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  neighborhood text,
  lat float8 not null,
  lng float8 not null,
  vibe_tags text[] default '{}',
  photo_url text,
  created_at timestamptz default now()
);

create table checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  venue_id uuid references venues(id),
  checked_in_at timestamptz default now(),
  is_live bool default true,
  night_date date default current_date
);

create table ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  venue_id uuid references venues(id),
  checkin_id uuid references checkins(id),
  would_return bool,
  attributes jsonb default '{}',
  note text check (char_length(note) <= 140),
  created_at timestamptz default now()
);

create table user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  badge_type text not null,
  unlocked_at timestamptz default now(),
  unique(user_id, badge_type)
);

create table groups (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_by uuid references users(id),
  venue_id uuid references venues(id),
  night_date date,
  member_ids uuid[] default '{}',
  created_at timestamptz default now()
);
