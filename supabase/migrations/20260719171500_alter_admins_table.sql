-- Alter admins table to support invitations and login tracking
ALTER TABLE public.admins 
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Pending', 'Inactive')),
  ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS permissions TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Drop the old restrictive select policy
DROP POLICY IF EXISTS "Allow authenticated users to read their own admin record" ON public.admins;

-- 1. SELECT POLICY: Any active administrator can read all admin records
DROP POLICY IF EXISTS "Allow active admins to select all admin records" ON public.admins;
CREATE POLICY "Allow active admins to select all admin records"
  ON public.admins FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

-- 2. INSERT POLICY: Super Admins and Admins can insert/invite new admins
DROP POLICY IF EXISTS "Allow privileged admins to insert admin records" ON public.admins;
CREATE POLICY "Allow privileged admins to insert admin records"
  ON public.admins FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
      AND role IN ('super_admin', 'admin')
    )
  );

-- 3. UPDATE POLICY: Super Admins and Admins can update admin records
DROP POLICY IF EXISTS "Allow privileged admins to update admin records" ON public.admins;
CREATE POLICY "Allow privileged admins to update admin records"
  ON public.admins FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
      AND role IN ('super_admin', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
      AND role IN ('super_admin', 'admin')
    )
  );

-- 4. DELETE POLICY: Super Admins and Admins can delete admin records
DROP POLICY IF EXISTS "Allow privileged admins to delete admin records" ON public.admins;
CREATE POLICY "Allow privileged admins to delete admin records"
  ON public.admins FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
      AND role IN ('super_admin', 'admin')
    )
  );

-- Update the primary admin row with default permissions
UPDATE public.admins
SET 
  status = 'Active',
  permissions = ARRAY['Dashboard', 'Inquiries', 'Testimonials', 'Resume Downloads', 'Analytics', 'Projects', 'Portfolio Configuration', 'Access Management']
WHERE email = 'ashokvangapandu45@gmail.com';
