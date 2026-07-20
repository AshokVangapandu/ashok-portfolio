-- Create access_requests table
CREATE TABLE IF NOT EXISTS public.access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  job_title TEXT,
  linkedin_url TEXT,
  reason TEXT NOT NULL,
  request_status TEXT NOT NULL DEFAULT 'pending' CHECK (request_status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row-Level Security
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- 1. INSERT POLICY: Anyone / Public can submit access requests
DROP POLICY IF EXISTS "Allow public insert of access_requests" ON public.access_requests;
CREATE POLICY "Allow public insert of access_requests"
  ON public.access_requests FOR INSERT TO public
  WITH CHECK (true);

-- 2. SELECT POLICY: Anyone / Public can check access requests
DROP POLICY IF EXISTS "Allow public select of access_requests" ON public.access_requests;
CREATE POLICY "Allow public select of access_requests"
  ON public.access_requests FOR SELECT TO public
  USING (true);

-- 3. ALL POLICY: Authenticated active admins in public.admins
DROP POLICY IF EXISTS "Allow admin full access to access_requests" ON public.access_requests;
CREATE POLICY "Allow admin full access to access_requests"
  ON public.access_requests FOR ALL TO authenticated
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
