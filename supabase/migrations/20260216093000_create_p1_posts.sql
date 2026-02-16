create table if not exists public.p1_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  slug text not null unique,
  content_markdown text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.p1_posts enable row level security;

create or replace function public.set_p1_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists p1_posts_set_updated_at on public.p1_posts;
create trigger p1_posts_set_updated_at
before update on public.p1_posts
for each row
execute procedure public.set_p1_posts_updated_at();

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'p1_posts'
      and policyname = 'Public can read published p1 posts'
  ) then
    create policy "Public can read published p1 posts"
      on public.p1_posts
      for select
      using (published = true);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'p1_posts'
      and policyname = 'Owners can read own p1 posts'
  ) then
    create policy "Owners can read own p1 posts"
      on public.p1_posts
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'p1_posts'
      and policyname = 'Authenticated users can insert own p1 posts'
  ) then
    create policy "Authenticated users can insert own p1 posts"
      on public.p1_posts
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'p1_posts'
      and policyname = 'Owners can update own p1 posts'
  ) then
    create policy "Owners can update own p1 posts"
      on public.p1_posts
      for update
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'p1_posts'
      and policyname = 'Owners can delete own p1 posts'
  ) then
    create policy "Owners can delete own p1 posts"
      on public.p1_posts
      for delete
      to authenticated
      using (auth.uid() = user_id);
  end if;
end;
$$;
