-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  category TEXT NOT NULL,
  client TEXT,
  role TEXT,
  timeline TEXT,
  platform TEXT,
  users TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  business_value TEXT,
  technologies TEXT[] DEFAULT '{}'::text[] NOT NULL,
  cover_image_url TEXT,
  images TEXT[] DEFAULT '{}'::text[] NOT NULL,
  problem_solved TEXT,
  solution TEXT,
  features TEXT[] DEFAULT '{}'::text[] NOT NULL,
  impact_metrics JSONB DEFAULT '[]'::jsonb NOT NULL,
  layout_type TEXT DEFAULT 'medium',
  demo_url TEXT,
  github_url TEXT,
  docs_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE
);

-- Index for layout, status, searching and display
CREATE INDEX IF NOT EXISTS idx_projects_status_featured ON public.projects (status, is_featured DESC, created_at DESC);

-- Enable Row-Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 1. SELECT POLICY: Anyone can read published projects
CREATE POLICY "Allow public select of published projects"
  ON public.projects FOR SELECT TO public
  USING (status = 'published');

-- 2. ADMIN CRUD POLICIES: Authenticated user who is an active admin in public.admins
CREATE POLICY "Allow admin select all projects"
  ON public.projects FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin insert all projects"
  ON public.projects FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin update all projects"
  ON public.projects FOR UPDATE TO authenticated
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

CREATE POLICY "Allow admin delete all projects"
  ON public.projects FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

-- Auto updated_at Trigger
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Create projects storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage bucket
CREATE POLICY "Allow public read of projects assets"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'projects');

CREATE POLICY "Allow admin insert of projects assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'projects'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin update of projects assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'projects'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin delete of projects assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'projects'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );
