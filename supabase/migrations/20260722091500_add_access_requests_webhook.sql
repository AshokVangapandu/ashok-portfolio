-- Create database trigger function to invoke the notify-admins-new-request Edge Function
create or replace function public.on_access_request_inserted()
returns trigger
security definer
language plpgsql
as $$
begin
  perform net.http_post(
    url := public.get_supabase_url() || '/functions/v1/notify-admins-new-request',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Webhook-Secret', 'db_webhook_secret_99882244'
    ),
    body := jsonb_build_object(
      'record', to_jsonb(new)
    )
  );
  return new;
end;
$$;

-- Create trigger AFTER INSERT on access_requests
drop trigger if exists tr_on_access_request_inserted on public.access_requests;
create trigger tr_on_access_request_inserted
  after insert on public.access_requests
  for each row execute function public.on_access_request_inserted();
