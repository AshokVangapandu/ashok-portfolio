-- Update trigger function to include designation, company, and rating
CREATE OR REPLACE FUNCTION public.on_testimonial_inserted()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://txoszrnjkrlbjzpjisvp.supabase.co/functions/v1/send-testimonial-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Webhook-Secret', 'db_webhook_secret_99882244'
    ),
    body := jsonb_build_object(
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
    )
  );
  RETURN new;
END;
$$;
