-- Create database trigger function to invoke the Edge Function
create or replace function public.on_contact_message_inserted()
returns trigger
security definer
language plpgsql
as $$
begin
  perform net.http_post(
    url := 'https://txoszrnjkrlbjzpjisvp.supabase.co/functions/v1/send-contact-email',
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

-- Create the trigger
create trigger tr_on_contact_message_inserted
  after insert on public.contact_messages
  for each row execute function public.on_contact_message_inserted();
