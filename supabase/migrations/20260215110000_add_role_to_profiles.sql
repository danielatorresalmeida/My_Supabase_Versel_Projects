alter table public.profiles
add column if not exists role text not null default 'user';
