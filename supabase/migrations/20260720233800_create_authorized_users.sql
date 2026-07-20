-- Create authorized_users table
CREATE TABLE IF NOT EXISTS public.authorized_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  access_status TEXT NOT NULL DEFAULT 'enabled' CHECK (access_status IN ('enabled', 'disabled')),
  access_level TEXT NOT NULL DEFAULT 'viewer' CHECK (access_level IN ('viewer', 'recruiter', 'client', 'admin')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  last_access TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row-Level Security
ALTER TABLE public.authorized_users ENABLE ROW LEVEL SECURITY;

-- 1. SELECT POLICY: Anyone / Public can check access status
DROP POLICY IF EXISTS "Allow public select of authorized_users" ON public.authorized_users;
CREATE POLICY "Allow public select of authorized_users"
  ON public.authorized_users FOR SELECT TO public
  USING (true);

-- 2. ALL POLICY: Authenticated active admins in public.admins
DROP POLICY IF EXISTS "Allow admin full access to authorized_users" ON public.authorized_users;
CREATE POLICY "Allow admin full access to authorized_users"
  ON public.authorized_users FOR ALL TO authenticated
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
