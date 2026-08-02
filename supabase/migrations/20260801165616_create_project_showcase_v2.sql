-- Create project_features table
CREATE TABLE IF NOT EXISTS public.project_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_thumbnail_url TEXT,
  image_alt TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create feature_bullets table
CREATE TABLE IF NOT EXISTS public.feature_bullets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id UUID NOT NULL REFERENCES public.project_features(id) ON DELETE CASCADE,
  text TEXT NOT NULL CHECK (char_length(trim(text)) > 0),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create project_gallery table
CREATE TABLE IF NOT EXISTS public.project_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  device_type TEXT CHECK (device_type IN ('Desktop', 'Tablet', 'Mobile', 'Analytics', 'Reports', 'Settings')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_project_features_project_id_display ON public.project_features(project_id, display_order);
CREATE INDEX IF NOT EXISTS idx_feature_bullets_feature_id_display ON public.feature_bullets(feature_id, display_order);
CREATE INDEX IF NOT EXISTS idx_project_gallery_project_id_display ON public.project_gallery(project_id, display_order);

-- Enable Row-Level Security
ALTER TABLE public.project_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_bullets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_gallery ENABLE ROW LEVEL SECURITY;

-- Auto updated_at Trigger for project_features
CREATE TRIGGER update_project_features_updated_at
  BEFORE UPDATE ON public.project_features
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- RLS Policies

-- project_features Policies
CREATE POLICY "Allow public select of published project features"
  ON public.project_features FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id
      AND p.status = 'published'
    )
  );

CREATE POLICY "Allow admin select all project features"
  ON public.project_features FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin insert project features"
  ON public.project_features FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin update project features"
  ON public.project_features FOR UPDATE TO authenticated
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

CREATE POLICY "Allow admin delete project features"
  ON public.project_features FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

-- feature_bullets Policies
CREATE POLICY "Allow public select of published feature bullets"
  ON public.feature_bullets FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.project_features f
      JOIN public.projects p ON p.id = f.project_id
      WHERE f.id = feature_id
      AND p.status = 'published'
    )
  );

CREATE POLICY "Allow admin select all feature bullets"
  ON public.feature_bullets FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin insert feature bullets"
  ON public.feature_bullets FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin update feature bullets"
  ON public.feature_bullets FOR UPDATE TO authenticated
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

CREATE POLICY "Allow admin delete feature bullets"
  ON public.feature_bullets FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

-- project_gallery Policies
CREATE POLICY "Allow public select of published project gallery"
  ON public.project_gallery FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id
      AND p.status = 'published'
    )
  );

CREATE POLICY "Allow admin select all project gallery"
  ON public.project_gallery FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin insert project gallery"
  ON public.project_gallery FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin update project gallery"
  ON public.project_gallery FOR UPDATE TO authenticated
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

CREATE POLICY "Allow admin delete project gallery"
  ON public.project_gallery FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );
