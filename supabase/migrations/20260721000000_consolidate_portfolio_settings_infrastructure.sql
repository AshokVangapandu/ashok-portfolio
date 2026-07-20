-- Consolidated Migration for Portfolio Settings Infrastructure

-- 1. Create portfolio_settings table
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'maintenance', 'private')),
  is_open_for_work BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for portfolio_settings
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select of portfolio settings') THEN
    CREATE POLICY "Allow public select of portfolio settings" ON public.portfolio_settings FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin update of portfolio settings') THEN
    CREATE POLICY "Allow admin update of portfolio settings" ON public.portfolio_settings FOR UPDATE TO authenticated USING (
      EXISTS (SELECT 1 FROM public.admins WHERE email = (SELECT auth.jwt() ->> 'email') AND is_active = true)
    ) WITH CHECK (
      EXISTS (SELECT 1 FROM public.admins WHERE email = (SELECT auth.jwt() ->> 'email') AND is_active = true)
    );
  END IF;
END $$;

-- Seed default portfolio settings row if empty
INSERT INTO public.portfolio_settings (id, visibility, is_open_for_work)
VALUES ('00000000-0000-0000-0000-000000000000', 'public', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create maintenance_subscribers table
CREATE TABLE IF NOT EXISTS public.maintenance_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'notified', 'unsubscribed')),
  notified_at TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'maintenance_page',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.maintenance_subscribers ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert of maintenance subscribers') THEN
    CREATE POLICY "Allow public insert of maintenance subscribers" ON public.maintenance_subscribers FOR INSERT TO public WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select of maintenance subscribers') THEN
    CREATE POLICY "Allow public select of maintenance subscribers" ON public.maintenance_subscribers FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin full access to maintenance subscribers') THEN
    CREATE POLICY "Allow admin full access to maintenance subscribers" ON public.maintenance_subscribers FOR ALL TO authenticated USING (
      EXISTS (SELECT 1 FROM public.admins WHERE email = (SELECT auth.jwt() ->> 'email') AND is_active = true)
    );
  END IF;
END $$;

-- 3. Create maintenance_notification_logs table
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

ALTER TABLE public.maintenance_notification_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert of maintenance notification logs') THEN
    CREATE POLICY "Allow public insert of maintenance notification logs" ON public.maintenance_notification_logs FOR INSERT TO public WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select of maintenance notification logs') THEN
    CREATE POLICY "Allow public select of maintenance notification logs" ON public.maintenance_notification_logs FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin full access to maintenance notification logs') THEN
    CREATE POLICY "Allow admin full access to maintenance notification logs" ON public.maintenance_notification_logs FOR ALL TO authenticated USING (
      EXISTS (SELECT 1 FROM public.admins WHERE email = (SELECT auth.jwt() ->> 'email') AND is_active = true)
    );
  END IF;
END $$;

-- 4. Create authorized_users table
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

ALTER TABLE public.authorized_users ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select of authorized_users') THEN
    CREATE POLICY "Allow public select of authorized_users" ON public.authorized_users FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin full access to authorized_users') THEN
    CREATE POLICY "Allow admin full access to authorized_users" ON public.authorized_users FOR ALL TO authenticated USING (
      EXISTS (SELECT 1 FROM public.admins WHERE email = (SELECT auth.jwt() ->> 'email') AND is_active = true)
    );
  END IF;
END $$;

-- 5. Create access_requests table
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

ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert of access_requests') THEN
    CREATE POLICY "Allow public insert of access_requests" ON public.access_requests FOR INSERT TO public WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select of access_requests') THEN
    CREATE POLICY "Allow public select of access_requests" ON public.access_requests FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin full access to access_requests') THEN
    CREATE POLICY "Allow admin full access to access_requests" ON public.access_requests FOR ALL TO authenticated USING (
      EXISTS (SELECT 1 FROM public.admins WHERE email = (SELECT auth.jwt() ->> 'email') AND is_active = true)
    );
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_portfolio_settings_visibility ON public.portfolio_settings(visibility);
CREATE INDEX IF NOT EXISTS idx_maintenance_subscribers_email ON public.maintenance_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_maintenance_subscribers_status ON public.maintenance_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_authorized_users_email ON public.authorized_users(email);
CREATE INDEX IF NOT EXISTS idx_authorized_users_status ON public.authorized_users(access_status);
CREATE INDEX IF NOT EXISTS idx_access_requests_email ON public.access_requests(email);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON public.access_requests(request_status);
