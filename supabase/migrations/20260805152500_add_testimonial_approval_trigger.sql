-- Create trigger function to handle testimonial status update (approval)
CREATE OR REPLACE FUNCTION public.on_testimonial_updated()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only trigger email when status changes to 'approved'
  IF (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'approved') THEN
    PERFORM net.http_post(
      url := public.get_supabase_url() || '/functions/v1/send-testimonial-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'X-Webhook-Secret', 'db_webhook_secret_99882244'
      ),
      body := jsonb_build_object(
        'record', jsonb_build_object(
          'id', NEW.id,
          'google_name', NEW.full_name,
          'google_email', NEW.email,
          'google_avatar', NEW.avatar_url,
          'linkedin_url', NEW.linkedin_url,
          'designation', NEW.designation,
          'company', NEW.company,
          'rating', NEW.rating,
          'testimonial', NEW.testimonial,
          'consent_public', NEW.is_visible,
          'status', NEW.status,
          'created_at', NEW.created_at
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create AFTER UPDATE trigger on public.testimonials table
DROP TRIGGER IF EXISTS tr_on_testimonial_updated ON public.testimonials;
CREATE TRIGGER tr_on_testimonial_updated
  AFTER UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.on_testimonial_updated();
