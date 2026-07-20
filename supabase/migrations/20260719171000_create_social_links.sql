-- Create social_links table
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row-Level Security
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- 1. SELECT POLICY: Anyone can read active social links
DROP POLICY IF EXISTS "Allow public select of social links" ON public.social_links;
DROP POLICY IF EXISTS "Allow public select of active social links" ON public.social_links;
CREATE POLICY "Allow public select of social links"
  ON public.social_links FOR SELECT TO public
  USING (true);

-- 2. ALL POLICY: Authenticated active admins in public.admins
DROP POLICY IF EXISTS "Allow admin full access to social links" ON public.social_links;
CREATE POLICY "Allow admin full access to social links"
  ON public.social_links FOR ALL TO authenticated
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

DROP POLICY IF EXISTS "Allow admin delete of social links" ON public.social_links;
CREATE POLICY "Allow admin delete of social links"
  ON public.social_links FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

-- Auto updated_at trigger
CREATE TRIGGER update_social_links_updated_at
  BEFORE UPDATE ON public.social_links
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Pre-populate default platforms
INSERT INTO public.social_links (platform, url, display_order) VALUES
  ('LinkedIn', 'https://linkedin.com/in/ashokvangapandu', 1),
  ('GitHub', 'https://github.com/ashokvangapandu', 2),
  ('Behance', 'https://behance.net/ashokvangapandu', 3),
  ('Twitter', 'https://twitter.com/ashok_vangapandu', 4)
ON CONFLICT (platform) DO NOTHING;
