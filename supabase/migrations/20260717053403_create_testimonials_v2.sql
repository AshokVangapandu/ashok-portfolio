-- Drop old testimonials table and triggers
DROP TABLE IF EXISTS public.testimonials CASCADE;

-- Create new testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  designation TEXT,
  country TEXT,
  avatar_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  testimonial TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  linkedin_url TEXT -- Added for compatibility with email/form logic
);

-- Enable Row-Level Security
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Indexing for visual listing and carousels
CREATE INDEX idx_testimonials_status_visibility ON public.testimonials (status, is_visible, display_order ASC, created_at DESC);

-- Public policies
CREATE POLICY "Allow public select of approved testimonials"
  ON public.testimonials FOR SELECT TO public
  USING (status = 'approved' AND is_visible = TRUE);

CREATE POLICY "Allow public insert of pending testimonials"
  ON public.testimonials FOR INSERT TO public
  WITH CHECK (status = 'pending' AND featured = FALSE AND is_visible = TRUE);

-- Admin policies (utilizing public.admins check)
CREATE POLICY "Allow admin select all"
  ON public.testimonials FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin insert all"
  ON public.testimonials FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin update all"
  ON public.testimonials FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin delete all"
  ON public.testimonials FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

-- Auto updated_at Trigger
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Webhook Trigger (maps new table schema to Edge Function properties)
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

CREATE TRIGGER tr_on_testimonial_inserted
  AFTER INSERT ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.on_testimonial_inserted();
