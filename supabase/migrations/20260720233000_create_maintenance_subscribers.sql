-- Create maintenance_subscribers table
CREATE TABLE IF NOT EXISTS public.maintenance_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'notified', 'unsubscribed')),
  notified_at TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'maintenance_page',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row-Level Security
ALTER TABLE public.maintenance_subscribers ENABLE ROW LEVEL SECURITY;

-- 1. INSERT POLICY: Anyone can subscribe to maintenance notifications
DROP POLICY IF EXISTS "Allow public insert of maintenance subscribers" ON public.maintenance_subscribers;
CREATE POLICY "Allow public insert of maintenance subscribers"
  ON public.maintenance_subscribers FOR INSERT TO public
  WITH CHECK (true);

-- 2. SELECT POLICY: Allow public check of existing email (for client-side duplicate verification)
DROP POLICY IF EXISTS "Allow public select of maintenance subscribers" ON public.maintenance_subscribers;
CREATE POLICY "Allow public select of maintenance subscribers"
  ON public.maintenance_subscribers FOR SELECT TO public
  USING (true);

-- 3. ALL POLICY: Authenticated active admins in public.admins
DROP POLICY IF EXISTS "Allow admin full access to maintenance subscribers" ON public.maintenance_subscribers;
CREATE POLICY "Allow admin full access to maintenance subscribers"
  ON public.maintenance_subscribers FOR ALL TO authenticated
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

-- Auto updated_at trigger
DROP TRIGGER IF EXISTS update_maintenance_subscribers_updated_at ON public.maintenance_subscribers;
CREATE TRIGGER update_maintenance_subscribers_updated_at
  BEFORE UPDATE ON public.maintenance_subscribers
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();
