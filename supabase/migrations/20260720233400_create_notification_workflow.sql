-- 1. Update status check constraint on maintenance_subscribers to allow 'queued'
ALTER TABLE public.maintenance_subscribers
  DROP CONSTRAINT IF EXISTS maintenance_subscribers_status_check;

ALTER TABLE public.maintenance_subscribers
  ADD CONSTRAINT maintenance_subscribers_status_check
  CHECK (status IN ('pending', 'queued', 'notified', 'unsubscribed'));

-- 2. Create maintenance_notification_logs table
CREATE TABLE IF NOT EXISTS public.maintenance_notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES public.maintenance_subscribers(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  transition_event TEXT DEFAULT 'maintenance_to_public',
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sending', 'sent', 'failed')),
  queued_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row-Level Security
ALTER TABLE public.maintenance_notification_logs ENABLE ROW LEVEL SECURITY;

-- 1. INSERT POLICY: Anyone / Public can log queued notifications
DROP POLICY IF EXISTS "Allow public insert of maintenance notification logs" ON public.maintenance_notification_logs;
CREATE POLICY "Allow public insert of maintenance notification logs"
  ON public.maintenance_notification_logs FOR INSERT TO public
  WITH CHECK (true);

-- 2. SELECT POLICY: Anyone / Public can select notification logs
DROP POLICY IF EXISTS "Allow public select of maintenance notification logs" ON public.maintenance_notification_logs;
CREATE POLICY "Allow public select of maintenance notification logs"
  ON public.maintenance_notification_logs FOR SELECT TO public
  USING (true);

-- 3. ALL POLICY: Authenticated active admins in public.admins
DROP POLICY IF EXISTS "Allow admin full access to maintenance notification logs" ON public.maintenance_notification_logs;
CREATE POLICY "Allow admin full access to maintenance notification logs"
  ON public.maintenance_notification_logs FOR ALL TO authenticated
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
