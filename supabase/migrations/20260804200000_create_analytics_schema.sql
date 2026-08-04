-- Create analytics schema: visitor_sessions, page_views, analytics_events, visitor_profiles

-- 1. Create visitor_profiles table
CREATE TABLE IF NOT EXISTS public.visitor_profiles (
  visitor_id TEXT PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create visitor_sessions table
CREATE TABLE IF NOT EXISTS public.visitor_sessions (
  id TEXT PRIMARY KEY, -- Matches frontend generated session_id
  visitor_id TEXT NOT NULL,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  user_agent TEXT,
  browser TEXT,
  operating_system TEXT,
  device_type TEXT,
  referrer TEXT,
  traffic_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  duration_seconds INTEGER DEFAULT 0 NOT NULL
);

-- 3. Create page_views table
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES public.visitor_sessions(id) ON DELETE CASCADE,
  page_path TEXT NOT NULL,
  page_title TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES public.visitor_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance & analytics grouping
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_visitor_id ON public.visitor_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_created_at ON public.visitor_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON public.page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON public.page_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_created ON public.analytics_events(event_type, created_at DESC);

-- Enable RLS
ALTER TABLE public.visitor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Revoke default public privileges
REVOKE ALL ON public.visitor_profiles FROM public;
REVOKE ALL ON public.visitor_sessions FROM public;
REVOKE ALL ON public.page_views FROM public;
REVOKE ALL ON public.analytics_events FROM public;

-- Grant specific privileges to roles
GRANT INSERT, SELECT, UPDATE ON public.visitor_profiles TO anon, authenticated;
GRANT ALL ON public.visitor_profiles TO service_role;

GRANT INSERT, SELECT, UPDATE ON public.visitor_sessions TO anon, authenticated;
GRANT ALL ON public.visitor_sessions TO service_role;

GRANT INSERT, SELECT ON public.page_views TO anon, authenticated;
GRANT ALL ON public.page_views TO service_role;

GRANT INSERT, SELECT ON public.analytics_events TO anon, authenticated;
GRANT ALL ON public.analytics_events TO service_role;

-- RLS Policies: Public Inserts & Updates (telemetry tracking)
CREATE POLICY "Allow public insert profiles" ON public.visitor_profiles FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public update profiles" ON public.visitor_profiles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public insert sessions" ON public.visitor_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public update sessions" ON public.visitor_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public insert page_views" ON public.page_views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public insert events" ON public.analytics_events FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Admin SELECT Policies (restricted to active admin users in public.admins)
CREATE POLICY "Allow admin select profiles" ON public.visitor_profiles FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE email = (SELECT auth.jwt() ->> 'email') AND is_active = true));

CREATE POLICY "Allow admin select sessions" ON public.visitor_sessions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE email = (SELECT auth.jwt() ->> 'email') AND is_active = true));

CREATE POLICY "Allow admin select page_views" ON public.page_views FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE email = (SELECT auth.jwt() ->> 'email') AND is_active = true));

CREATE POLICY "Allow admin select events" ON public.analytics_events FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE email = (SELECT auth.jwt() ->> 'email') AND is_active = true));

-- Admin Mutation Policies
CREATE POLICY "Allow admin all profiles" ON public.visitor_profiles FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE email = (SELECT auth.jwt() ->> 'email') AND is_active = true));

CREATE POLICY "Allow admin all sessions" ON public.visitor_sessions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE email = (SELECT auth.jwt() ->> 'email') AND is_active = true));

CREATE POLICY "Allow admin all page_views" ON public.page_views FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE email = (SELECT auth.jwt() ->> 'email') AND is_active = true));

CREATE POLICY "Allow admin all events" ON public.analytics_events FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE email = (SELECT auth.jwt() ->> 'email') AND is_active = true));
