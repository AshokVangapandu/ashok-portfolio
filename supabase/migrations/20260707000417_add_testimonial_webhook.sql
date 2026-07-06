-- Create database trigger function to invoke the send-testimonial-email Edge Function
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
      'record', to_jsonb(new)
    )
  );
  RETURN new;
END;
$$;

-- Create trigger AFTER INSERT on testimonials
DROP TRIGGER IF EXISTS tr_on_testimonial_inserted ON public.testimonials;
CREATE TRIGGER tr_on_testimonial_inserted
  AFTER INSERT ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.on_testimonial_inserted();
