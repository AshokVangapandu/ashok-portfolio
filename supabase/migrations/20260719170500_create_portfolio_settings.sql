-- Create portfolio_settings table
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'maintenance', 'private')),
  is_open_for_work BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row-Level Security
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;

-- 1. SELECT POLICY: Anyone can read portfolio settings
CREATE POLICY "Allow public select of portfolio settings"
  ON public.portfolio_settings FOR SELECT TO public
  USING (true);

-- 2. UPDATE POLICY: Authenticated active admins in public.admins
CREATE POLICY "Allow admin update of portfolio settings"
  ON public.portfolio_settings FOR UPDATE TO authenticated
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
CREATE TRIGGER update_portfolio_settings_updated_at
  BEFORE UPDATE ON public.portfolio_settings
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Pre-populate default row
INSERT INTO public.portfolio_settings (id, visibility, is_open_for_work)
VALUES ('00000000-0000-0000-0000-000000000000', 'public', true)
ON CONFLICT (id) DO NOTHING;
