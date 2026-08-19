-- Phase 2: Admin Security & Access Hardening

-- Non-recursive admin authorization helpers for RLS policies.
CREATE OR REPLACE FUNCTION public.current_admin_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role
  FROM public.admins
  WHERE lower(email) = lower((SELECT auth.jwt() ->> 'email'))
    AND is_active = true
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT public.current_admin_role() IS NOT NULL
$$;

CREATE OR REPLACE FUNCTION public.is_active_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT public.current_admin_role() = 'super_admin'
$$;

REVOKE ALL ON FUNCTION public.current_admin_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_active_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_active_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_admin_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_active_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_active_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_admin_role() TO service_role;
GRANT EXECUTE ON FUNCTION public.is_active_admin() TO service_role;
GRANT EXECUTE ON FUNCTION public.is_active_super_admin() TO service_role;

-- Public private-access verifier. Returns only a boolean and records last access.
CREATE OR REPLACE FUNCTION public.verify_private_access(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_email TEXT := lower(trim(coalesce(p_email, '')));
  matched BOOLEAN := false;
BEGIN
  IF normalized_email = '' THEN
    RETURN false;
  END IF;

  UPDATE public.authorized_users
  SET
    last_access = timezone('utc'::text, now()),
    updated_at = timezone('utc'::text, now())
  WHERE lower(email) = normalized_email
    AND access_status = 'enabled'
  RETURNING true INTO matched;

  RETURN coalesce(matched, false);
END;
$$;

REVOKE ALL ON FUNCTION public.verify_private_access(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_private_access(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_private_access(TEXT) TO service_role;

-- Public maintenance subscription helpers. They avoid exposing subscriber rows.
CREATE OR REPLACE FUNCTION public.subscribe_maintenance_notification(p_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_email TEXT := lower(trim(coalesce(p_email, '')));
  existing_status TEXT;
BEGIN
  IF normalized_email = '' THEN
    RAISE EXCEPTION 'Email is required.';
  END IF;

  SELECT status
  INTO existing_status
  FROM public.maintenance_subscribers
  WHERE lower(email) = normalized_email
  FOR UPDATE;

  IF existing_status IS NULL THEN
    INSERT INTO public.maintenance_subscribers (email, status, source)
    VALUES (normalized_email, 'pending', 'maintenance_page');
    RETURN 'subscribed';
  END IF;

  IF existing_status IN ('pending', 'queued') THEN
    RETURN 'duplicate';
  END IF;

  UPDATE public.maintenance_subscribers
  SET
    status = 'pending',
    updated_at = timezone('utc'::text, now()),
    source = 'maintenance_page'
  WHERE lower(email) = normalized_email;

  RETURN 'subscribed';
END;
$$;

CREATE OR REPLACE FUNCTION public.check_maintenance_subscription(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.maintenance_subscribers
    WHERE lower(email) = lower(trim(coalesce(p_email, '')))
      AND status IN ('pending', 'queued')
  )
$$;

REVOKE ALL ON FUNCTION public.subscribe_maintenance_notification(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_maintenance_subscription(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.subscribe_maintenance_notification(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_maintenance_subscription(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.subscribe_maintenance_notification(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.check_maintenance_subscription(TEXT) TO service_role;

-- Explicit table grants for current Supabase Data API behavior.
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorized_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_notification_logs ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.admins FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.authorized_users FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.access_requests FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.maintenance_subscribers FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.maintenance_notification_logs FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admins TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.authorized_users TO authenticated;
GRANT INSERT ON public.access_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.access_requests TO authenticated;
GRANT INSERT ON public.maintenance_subscribers TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.maintenance_subscribers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.maintenance_notification_logs TO authenticated;

GRANT ALL ON public.admins TO service_role;
GRANT ALL ON public.authorized_users TO service_role;
GRANT ALL ON public.access_requests TO service_role;
GRANT ALL ON public.maintenance_subscribers TO service_role;
GRANT ALL ON public.maintenance_notification_logs TO service_role;

-- Remove insecure/public policies and previous recursive admin policies.
DROP POLICY IF EXISTS "Allow authenticated users to read their own admin record" ON public.admins;
DROP POLICY IF EXISTS "Allow active admins to select all admin records" ON public.admins;
DROP POLICY IF EXISTS "Allow public select of admins" ON public.admins;
DROP POLICY IF EXISTS "Allow privileged admins to insert admin records" ON public.admins;
DROP POLICY IF EXISTS "Allow privileged admins to update admin records" ON public.admins;
DROP POLICY IF EXISTS "Allow privileged admins to delete admin records" ON public.admins;
DROP POLICY IF EXISTS "Allow users to update their own admin record" ON public.admins;

DROP POLICY IF EXISTS "Allow public select of authorized_users" ON public.authorized_users;
DROP POLICY IF EXISTS "Allow admin full access to authorized_users" ON public.authorized_users;

DROP POLICY IF EXISTS "Allow public insert of access_requests" ON public.access_requests;
DROP POLICY IF EXISTS "Allow public select of access_requests" ON public.access_requests;
DROP POLICY IF EXISTS "Allow admin full access to access_requests" ON public.access_requests;

DROP POLICY IF EXISTS "Allow public insert of maintenance subscribers" ON public.maintenance_subscribers;
DROP POLICY IF EXISTS "Allow public select of maintenance subscribers" ON public.maintenance_subscribers;
DROP POLICY IF EXISTS "Allow admin full access to maintenance subscribers" ON public.maintenance_subscribers;

DROP POLICY IF EXISTS "Allow public insert of maintenance notification logs" ON public.maintenance_notification_logs;
DROP POLICY IF EXISTS "Allow public select of maintenance notification logs" ON public.maintenance_notification_logs;
DROP POLICY IF EXISTS "Allow admin full access to maintenance notification logs" ON public.maintenance_notification_logs;

-- admins: self-read, active-admin read, super-admin management, own metadata update.
CREATE POLICY "Admins can read own admin record"
  ON public.admins FOR SELECT TO authenticated
  USING (lower(email) = lower((SELECT auth.jwt() ->> 'email')));

CREATE POLICY "Active admins can read admin records"
  ON public.admins FOR SELECT TO authenticated
  USING ((SELECT public.is_active_admin()));

CREATE POLICY "Super admins can insert admin records"
  ON public.admins FOR INSERT TO authenticated
  WITH CHECK ((SELECT public.is_active_super_admin()));

CREATE POLICY "Super admins can update admin records"
  ON public.admins FOR UPDATE TO authenticated
  USING ((SELECT public.is_active_super_admin()))
  WITH CHECK ((SELECT public.is_active_super_admin()));

CREATE POLICY "Super admins can delete admin records"
  ON public.admins FOR DELETE TO authenticated
  USING ((SELECT public.is_active_super_admin()));

CREATE POLICY "Admins can update own profile metadata"
  ON public.admins FOR UPDATE TO authenticated
  USING (lower(email) = lower((SELECT auth.jwt() ->> 'email')))
  WITH CHECK (lower(email) = lower((SELECT auth.jwt() ->> 'email')));

CREATE OR REPLACE FUNCTION public.protect_admin_roles()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NOT (SELECT public.is_active_super_admin()) THEN
      RAISE EXCEPTION 'Only active Super Admins can create admin records.';
    END IF;
    RETURN NEW;
  END IF;

  IF (OLD.role IS DISTINCT FROM NEW.role OR
      OLD.permissions IS DISTINCT FROM NEW.permissions OR
      OLD.is_active IS DISTINCT FROM NEW.is_active) THEN
    IF NOT (SELECT public.is_active_super_admin()) THEN
      RAISE EXCEPTION 'Only active Super Admins can modify admin roles, permissions, or active status.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_protect_admin_roles ON public.admins;
CREATE TRIGGER tr_protect_admin_roles
  BEFORE INSERT OR UPDATE ON public.admins
  FOR EACH ROW EXECUTE FUNCTION public.protect_admin_roles();

-- authorized_users: public verification goes through verify_private_access().
CREATE POLICY "Authorized users can read own enabled record"
  ON public.authorized_users FOR SELECT TO authenticated
  USING (
    lower(email) = lower((SELECT auth.jwt() ->> 'email'))
    AND access_status = 'enabled'
  );

CREATE POLICY "Admins can read authorized users"
  ON public.authorized_users FOR SELECT TO authenticated
  USING ((SELECT public.is_active_admin()));

CREATE POLICY "Admins can insert authorized users"
  ON public.authorized_users FOR INSERT TO authenticated
  WITH CHECK ((SELECT public.is_active_admin()));

CREATE POLICY "Admins can update authorized users"
  ON public.authorized_users FOR UPDATE TO authenticated
  USING ((SELECT public.is_active_admin()))
  WITH CHECK ((SELECT public.is_active_admin()));

CREATE POLICY "Admins can delete authorized users"
  ON public.authorized_users FOR DELETE TO authenticated
  USING ((SELECT public.is_active_admin()));

-- access_requests: public submission, no public enumeration.
CREATE UNIQUE INDEX IF NOT EXISTS idx_access_requests_pending_email_unique
  ON public.access_requests (lower(email))
  WHERE request_status = 'pending';

CREATE POLICY "Public can submit access requests"
  ON public.access_requests FOR INSERT TO anon, authenticated
  WITH CHECK (request_status = 'pending');

CREATE POLICY "Users can read own access requests"
  ON public.access_requests FOR SELECT TO authenticated
  USING (lower(email) = lower((SELECT auth.jwt() ->> 'email')));

CREATE POLICY "Admins can read access requests"
  ON public.access_requests FOR SELECT TO authenticated
  USING ((SELECT public.is_active_admin()));

CREATE POLICY "Admins can update access requests"
  ON public.access_requests FOR UPDATE TO authenticated
  USING ((SELECT public.is_active_admin()))
  WITH CHECK ((SELECT public.is_active_admin()));

CREATE POLICY "Admins can delete access requests"
  ON public.access_requests FOR DELETE TO authenticated
  USING ((SELECT public.is_active_admin()));

-- maintenance_subscribers: public submission, no public enumeration.
CREATE POLICY "Public can submit maintenance subscribers"
  ON public.maintenance_subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');

CREATE POLICY "Users can read own maintenance subscription"
  ON public.maintenance_subscribers FOR SELECT TO authenticated
  USING (lower(email) = lower((SELECT auth.jwt() ->> 'email')));

CREATE POLICY "Admins can read maintenance subscribers"
  ON public.maintenance_subscribers FOR SELECT TO authenticated
  USING ((SELECT public.is_active_admin()));

CREATE POLICY "Admins can insert maintenance subscribers"
  ON public.maintenance_subscribers FOR INSERT TO authenticated
  WITH CHECK ((SELECT public.is_active_admin()));

CREATE POLICY "Admins can update maintenance subscribers"
  ON public.maintenance_subscribers FOR UPDATE TO authenticated
  USING ((SELECT public.is_active_admin()))
  WITH CHECK ((SELECT public.is_active_admin()));

CREATE POLICY "Admins can delete maintenance subscribers"
  ON public.maintenance_subscribers FOR DELETE TO authenticated
  USING ((SELECT public.is_active_admin()));

-- maintenance_notification_logs: internal/admin only.
CREATE POLICY "Admins can read maintenance notification logs"
  ON public.maintenance_notification_logs FOR SELECT TO authenticated
  USING ((SELECT public.is_active_admin()));

CREATE POLICY "Admins can insert maintenance notification logs"
  ON public.maintenance_notification_logs FOR INSERT TO authenticated
  WITH CHECK ((SELECT public.is_active_admin()));

CREATE POLICY "Admins can update maintenance notification logs"
  ON public.maintenance_notification_logs FOR UPDATE TO authenticated
  USING ((SELECT public.is_active_admin()))
  WITH CHECK ((SELECT public.is_active_admin()));

CREATE POLICY "Admins can delete maintenance notification logs"
  ON public.maintenance_notification_logs FOR DELETE TO authenticated
  USING ((SELECT public.is_active_admin()));
