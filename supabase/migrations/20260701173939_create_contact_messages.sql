-- Create the contact_messages table
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) > 0),
  email text not null check (char_length(trim(email)) > 0),
  company text,
  phone_number text,
  subject text not null check (char_length(trim(subject)) > 0),
  message text not null check (char_length(trim(message)) > 0),
  status text not null default 'New',
  created_at timestamp with time zone not null default now()
);

-- Enable RLS
alter table public.contact_messages enable row level security;

-- Force RLS even for table owners (standard PostgreSQL practice)
alter table public.contact_messages force row level security;

-- Revoke default public access on the table to enforce least privilege
revoke all on public.contact_messages from public;

-- Grant specific privileges to roles
grant insert on public.contact_messages to anon;
grant insert, select, update, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;

-- RLS Policy: Allow anonymous users to INSERT new contact messages
create policy "Allow anonymous inserts"
on public.contact_messages
for insert
to anon
with check (true);

-- RLS Policy: Allow authenticated users to INSERT new contact messages (as fallback)
create policy "Allow authenticated inserts"
on public.contact_messages
for insert
to authenticated
with check (true);

-- RLS Policy: Allow only authenticated administrators to SELECT contact messages
create policy "Allow admin select"
on public.contact_messages
for select
to authenticated
using (
  (select (auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'
);

-- RLS Policy: Allow only authenticated administrators to UPDATE contact messages
create policy "Allow admin update"
on public.contact_messages
for update
to authenticated
using (
  (select (auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'
)
with check (
  (select (auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'
);

-- RLS Policy: Allow only authenticated administrators to DELETE contact messages
create policy "Allow admin delete"
on public.contact_messages
for delete
to authenticated
using (
  (select (auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'
);
