-- Create resume_settings table
CREATE TABLE IF NOT EXISTS public.resume_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  preview_url TEXT NOT NULL,
  version TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE
);

-- Index for lookup optimization
CREATE INDEX IF NOT EXISTS idx_resume_settings_is_active ON public.resume_settings (is_active) WHERE is_active = TRUE;

-- Enable Row-Level Security
ALTER TABLE public.resume_settings ENABLE ROW LEVEL SECURITY;

-- 1. SELECT POLICY: Anyone can read the active resume
DROP POLICY IF EXISTS "Allow public select of active resume" ON public.resume_settings;
CREATE POLICY "Allow public select of active resume"
  ON public.resume_settings FOR SELECT TO public
  USING (is_active = TRUE);

-- 2. ADMIN CRUD POLICIES: Authenticated active admins in public.admins
DROP POLICY IF EXISTS "Allow admin select all resume settings" ON public.resume_settings;
CREATE POLICY "Allow admin select all resume settings"
  ON public.resume_settings FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Allow admin insert resume settings" ON public.resume_settings;
CREATE POLICY "Allow admin insert resume settings"
  ON public.resume_settings FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Allow admin update resume settings" ON public.resume_settings;
CREATE POLICY "Allow admin update resume settings"
  ON public.resume_settings FOR UPDATE TO authenticated
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

DROP POLICY IF EXISTS "Allow admin delete resume settings" ON public.resume_settings;
CREATE POLICY "Allow admin delete resume settings"
  ON public.resume_settings FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

-- Auto updated_at trigger
DROP TRIGGER IF EXISTS update_resume_settings_updated_at ON public.resume_settings;
CREATE TRIGGER update_resume_settings_updated_at
  BEFORE UPDATE ON public.resume_settings
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Trigger to enforce only one active resume at a time
CREATE OR REPLACE FUNCTION public.handle_resume_is_active_deactivation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.resume_settings
  SET is_active = FALSE, updated_at = timezone('utc'::text, now())
  WHERE id != NEW.id AND is_active = TRUE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_single_active_resume ON public.resume_settings;
CREATE TRIGGER enforce_single_active_resume
  AFTER INSERT OR UPDATE ON public.resume_settings
  FOR EACH ROW
  WHEN (NEW.is_active = TRUE)
  EXECUTE PROCEDURE public.handle_resume_is_active_deactivation();

-- Create resume-files storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('resume-files', 'resume-files', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for resume-files bucket
DROP POLICY IF EXISTS "Allow public read of resume-files" ON storage.objects;
CREATE POLICY "Allow public read of resume-files"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'resume-files');

DROP POLICY IF EXISTS "Allow admin insert of resume-files" ON storage.objects;
CREATE POLICY "Allow admin insert of resume-files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'resume-files'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Allow admin update of resume-files" ON storage.objects;
CREATE POLICY "Allow admin update of resume-files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'resume-files'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  )
  WITH CHECK (
    bucket_id = 'resume-files'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Allow admin delete of resume-files" ON storage.objects;
CREATE POLICY "Allow admin delete of resume-files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'resume-files'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );
