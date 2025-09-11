-- Create profiles table and auto-populate on user signup
create table if not exists public.profiles (
  id uuid primary key,
  email text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies: users can view/update their own profile
create policy if not exists "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy if not exists "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy if not exists "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Function to handle new user creation and insert into profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger on auth.users to populate profiles
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();