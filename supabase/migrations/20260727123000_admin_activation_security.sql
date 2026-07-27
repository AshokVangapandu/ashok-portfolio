-- Allow users to update their own admin record on first login / activity update
DROP POLICY IF EXISTS "Allow users to update their own admin record" ON public.admins;
CREATE POLICY "Allow users to update their own admin record"
  ON public.admins FOR UPDATE TO authenticated
  USING (email = (SELECT auth.jwt() ->> 'email'))
  WITH CHECK (email = (SELECT auth.jwt() ->> 'email'));

-- Trigger to prevent non-super_admins from escalating roles/permissions or altering active status
CREATE OR REPLACE FUNCTION public.protect_admin_roles()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if privileged fields are being modified
  IF (OLD.role IS DISTINCT FROM NEW.role OR 
      OLD.permissions IS DISTINCT FROM NEW.permissions OR 
      OLD.is_active IS DISTINCT FROM NEW.is_active) THEN
    -- Check if current authenticated user is an active super_admin
    IF NOT EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND role = 'super_admin'
      AND is_active = true
    ) THEN
      RAISE EXCEPTION 'Only active Super Admins can modify admin roles, permissions, or active status.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_protect_admin_roles ON public.admins;
CREATE TRIGGER tr_protect_admin_roles
  BEFORE UPDATE ON public.admins
  FOR EACH ROW EXECUTE FUNCTION public.protect_admin_roles();
