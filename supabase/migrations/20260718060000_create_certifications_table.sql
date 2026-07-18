-- Create certifications table
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  issue_date TEXT NOT NULL,
  expiry_date TEXT,
  credential_id TEXT,
  credential_url TEXT,
  certificate_image_url TEXT,
  certificate_file_url TEXT,
  skills TEXT[] DEFAULT '{}'::text[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Index for visual listing, searching, and filtering
CREATE INDEX IF NOT EXISTS idx_certifications_status_featured ON public.certifications (status, is_featured DESC, display_order ASC, created_at DESC);

-- Enable Row-Level Security
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- 1. SELECT POLICY: Anyone can read published certifications
CREATE POLICY "Allow public select of published certifications"
  ON public.certifications FOR SELECT TO public
  USING (status = 'published');

-- 2. ADMIN CRUD POLICIES: Authenticated user who is an active admin in public.admins
CREATE POLICY "Allow admin select all"
  ON public.certifications FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin insert all"
  ON public.certifications FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin update all"
  ON public.certifications FOR UPDATE TO authenticated
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
  ON public.certifications FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

-- Auto updated_at Trigger
CREATE TRIGGER update_certifications_updated_at
  BEFORE UPDATE ON public.certifications
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Create certifications storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('certifications', 'certifications', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage bucket
CREATE POLICY "Allow public read of certifications assets"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'certifications');

CREATE POLICY "Allow admin insert of certifications assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'certifications'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin update of certifications assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'certifications'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  )
  WITH CHECK (
    bucket_id = 'certifications'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin delete of certifications assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'certifications'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );
