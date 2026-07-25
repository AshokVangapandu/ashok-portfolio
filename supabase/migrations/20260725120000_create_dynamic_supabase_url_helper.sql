-- Helper function to fetch the dynamic Supabase URL from database settings
-- Resolves local/production separation for database webhooks.
create or replace function public.get_supabase_url()
returns text as $$
begin
  return coalesce(
    nullif(current_setting('app.settings.supabase_url', true), ''),
    'https://txoszrnjkrlbjzpjisvp.supabase.co'
  );
end;
$$ language plpgsql;
