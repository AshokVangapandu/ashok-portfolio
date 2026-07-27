-- Restrict admin management UPDATE policy to super_admin only
DROP POLICY IF EXISTS "Allow privileged admins to update admin records" ON public.admins;
CREATE POLICY "Allow privileged admins to update admin records"
  ON public.admins FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
      AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
      AND role = 'super_admin'
    )
  );

-- Restrict admin management DELETE policy to super_admin only
DROP POLICY IF EXISTS "Allow privileged admins to delete admin records" ON public.admins;
CREATE POLICY "Allow privileged admins to delete admin records"
  ON public.admins FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
      AND role = 'super_admin'
    )
  );
