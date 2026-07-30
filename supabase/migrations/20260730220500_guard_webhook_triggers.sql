-- 1. Redefine on_contact_message_inserted checking pg_extension for pg_net
CREATE OR REPLACE FUNCTION public.on_contact_message_inserted()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN
    EXECUTE format(
      'SELECT net.http_post(
        url := %L,
        headers := %L,
        body := %L
      )',
      public.get_supabase_url() || '/functions/v1/send-contact-email',
      jsonb_build_object(
        'Content-Type', 'application/json',
        'X-Webhook-Secret', 'db_webhook_secret_99882244'
      )::text,
      to_jsonb(new)::text
    );
  END IF;
  RETURN new;
END;
$$;

-- 2. Redefine on_access_request_inserted checking pg_extension for pg_net
CREATE OR REPLACE FUNCTION public.on_access_request_inserted()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN
    EXECUTE format(
      'SELECT net.http_post(
        url := %L,
        headers := %L,
        body := %L
      )',
      public.get_supabase_url() || '/functions/v1/notify-admins-new-request',
      jsonb_build_object(
        'Content-Type', 'application/json',
        'X-Webhook-Secret', 'db_webhook_secret_99882244'
      )::text,
      to_jsonb(new)::text
    );
  END IF;
  RETURN new;
END;
$$;

-- 3. Redefine on_testimonial_inserted checking pg_extension for pg_net
CREATE OR REPLACE FUNCTION public.on_testimonial_inserted()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN
    EXECUTE format(
      'SELECT net.http_post(
        url := %L,
        headers := %L,
        body := %L
      )',
      public.get_supabase_url() || '/functions/v1/send-testimonial-email',
      jsonb_build_object(
        'Content-Type', 'application/json',
        'X-Webhook-Secret', 'db_webhook_secret_99882244'
      )::text,
      jsonb_build_object(
        'record', jsonb_build_object(
          'id', new.id,
          'google_name', new.full_name,
          'google_email', new.email,
          'google_avatar', new.avatar_url,
          'linkedin_url', new.linkedin_url,
          'designation', new.designation,
          'company', new.company,
          'rating', new.rating,
          'testimonial', new.testimonial,
          'consent_public', true,
          'status', new.status,
          'created_at', new.created_at
        )
      )::text
    );
  END IF;
  RETURN new;
END;
$$;
