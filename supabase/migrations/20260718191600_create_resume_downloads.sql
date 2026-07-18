-- Create resume_downloads table
CREATE TABLE IF NOT EXISTS public.resume_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES public.resume_settings(id) ON DELETE SET NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  session_id TEXT,
  visitor_id TEXT,
  page_source TEXT,
  referrer TEXT,
  user_agent TEXT,
  browser TEXT,
  operating_system TEXT,
  device_type TEXT,
  country TEXT,
  city TEXT,
  ip_address TEXT,
  download_status TEXT NOT NULL DEFAULT 'completed'
);

-- Index for analytics and reports
CREATE INDEX IF NOT EXISTS idx_resume_downloads_resume_id ON public.resume_downloads (resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_downloads_downloaded_at ON public.resume_downloads (downloaded_at DESC);

-- Enable RLS
ALTER TABLE public.resume_downloads ENABLE ROW LEVEL SECURITY;

-- Revoke default public access on the table to enforce least privilege
REVOKE ALL ON public.resume_downloads FROM public;

-- Grant specific privileges to roles
GRANT INSERT, UPDATE ON public.resume_downloads TO anon;
GRANT INSERT, SELECT, UPDATE, DELETE ON public.resume_downloads TO authenticated;
GRANT ALL ON public.resume_downloads TO service_role;

-- 1. INSERT POLICY: Anyone can log a download
CREATE POLICY "Allow public insert of download tracking"
  ON public.resume_downloads FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- 2. UPDATE POLICY: Anyone can update download status (e.g., if a download fails)
CREATE POLICY "Allow public update of download status"
  ON public.resume_downloads FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 3. ADMIN READ/WRITE POLICIES: Authenticated active admins in public.admins
CREATE POLICY "Allow admin select all resume downloads"
  ON public.resume_downloads FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin update all resume downloads"
  ON public.resume_downloads FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      and is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      and is_active = true
    )
  );

CREATE POLICY "Allow admin delete all resume downloads"
  ON public.resume_downloads FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      and is_active = true
    )
  );
