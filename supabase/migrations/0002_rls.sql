-- Row Level Security for friend-graph privacy.

alter table users enable row level security;
alter table friendships enable row level security;
alter table venues enable row level security;
alter table checkins enable row level security;
alter table ratings enable row level security;
alter table user_badges enable row level security;
alter table groups enable row level security;

-- helper: accepted friendship in either direction
create or replace function is_friend(a uuid, b uuid) returns bool
language sql stable security definer as $$
  select exists (
    select 1 from friendships
    where status = 'accepted'
      and ((user_id = a and friend_id = b) or (user_id = b and friend_id = a))
  );
$$;

-- users: readable by all if public, else friends only; self always
create policy users_select on users for select using (
  is_public or id = auth.uid() or is_friend(id, auth.uid())
);
create policy users_insert on users for insert with check (id = auth.uid());
create policy users_update on users for update using (id = auth.uid());

-- friendships: visible to either party; created by requester
create policy friendships_select on friendships for select using (
  user_id = auth.uid() or friend_id = auth.uid()
);
create policy friendships_insert on friendships for insert with check (user_id = auth.uid());
create policy friendships_update on friendships for update using (friend_id = auth.uid());

-- venues: public read
create policy venues_select on venues for select using (true);

-- checkins: readable by the user and their friends
create policy checkins_select on checkins for select using (
  user_id = auth.uid() or is_friend(user_id, auth.uid())
);
create policy checkins_insert on checkins for insert with check (user_id = auth.uid());
create policy checkins_update on checkins for update using (user_id = auth.uid());

-- ratings: readable by the user only
create policy ratings_select on ratings for select using (user_id = auth.uid());
create policy ratings_insert on ratings for insert with check (user_id = auth.uid());

-- badges: own + friends (for the social grid)
create policy badges_select on user_badges for select using (
  user_id = auth.uid() or is_friend(user_id, auth.uid())
);
create policy badges_insert on user_badges for insert with check (user_id = auth.uid());

-- groups: members + creator
create policy groups_select on groups for select using (
  created_by = auth.uid() or auth.uid() = any(member_ids)
);
create policy groups_insert on groups for insert with check (created_by = auth.uid());
create policy groups_update on groups for update using (created_by = auth.uid());
