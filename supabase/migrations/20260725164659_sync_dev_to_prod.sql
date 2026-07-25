-- 1. Create tools_products table
CREATE TABLE IF NOT EXISTS public.tools_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Widget' CHECK (type IN ('Widget', 'Action', 'Template', 'Plugin', 'Tool')),
  version TEXT NOT NULL DEFAULT '1.0.0',
  category TEXT NOT NULL DEFAULT 'General',
  cover_image_url TEXT,
  preview_image_url TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  downloads INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  marketplace_url TEXT,
  github_url TEXT,
  docs_url TEXT,
  demo_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_coming_soon BOOLEAN NOT NULL DEFAULT FALSE,
  problem_solved TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published'))
);

-- 2. Create projects table
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

-- 3. Create product_capabilities table
CREATE TABLE IF NOT EXISTS public.product_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.tools_products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create product_technologies table
CREATE TABLE IF NOT EXISTS public.product_technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.tools_products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create performance and constraint indexes
CREATE INDEX IF NOT EXISTS idx_tools_products_status ON public.tools_products (status, is_featured DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status_featured ON public.projects (status, is_featured DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_capabilities_product_id ON public.product_capabilities (product_id, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_technologies_product_id ON public.product_technologies (product_id, display_order ASC);

-- 6. Enable Row-Level Security
ALTER TABLE public.tools_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_technologies ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for projects
DROP POLICY IF EXISTS "Allow public select of published projects" ON public.projects;
CREATE POLICY "Allow public select of published projects"
  ON public.projects FOR SELECT TO public
  USING (status = 'published');

DROP POLICY IF EXISTS "Allow admin select all projects" ON public.projects;
CREATE POLICY "Allow admin select all projects"
  ON public.projects FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Allow admin insert all projects" ON public.projects;
CREATE POLICY "Allow admin insert all projects"
  ON public.projects FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Allow admin update all projects" ON public.projects;
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

DROP POLICY IF EXISTS "Allow admin delete all projects" ON public.projects;
CREATE POLICY "Allow admin delete all projects"
  ON public.projects FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

-- 8. RLS Policies for tools_products
DROP POLICY IF EXISTS "Allow public select of published products" ON public.tools_products;
CREATE POLICY "Allow public select of published products"
  ON public.tools_products FOR SELECT TO public
  USING (status = 'published');

DROP POLICY IF EXISTS "Allow admin select all products" ON public.tools_products;
CREATE POLICY "Allow admin select all products"
  ON public.tools_products FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Allow admin insert all products" ON public.tools_products;
CREATE POLICY "Allow admin insert all products"
  ON public.tools_products FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Allow admin update all products" ON public.tools_products;
CREATE POLICY "Allow admin update all products"
  ON public.tools_products FOR UPDATE TO authenticated
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

DROP POLICY IF EXISTS "Allow admin delete all products" ON public.tools_products;
CREATE POLICY "Allow admin delete all products"
  ON public.tools_products FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

-- 9. RLS Policies for product_capabilities
DROP POLICY IF EXISTS "Allow public select of capabilities" ON public.product_capabilities;
CREATE POLICY "Allow public select of capabilities"
  ON public.product_capabilities FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.tools_products
      WHERE id = product_capabilities.product_id
      AND status = 'published'
    )
  );

DROP POLICY IF EXISTS "Allow admin select all capabilities" ON public.product_capabilities;
CREATE POLICY "Allow admin select all capabilities"
  ON public.product_capabilities FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Allow admin insert all capabilities" ON public.product_capabilities;
CREATE POLICY "Allow admin insert all capabilities"
  ON public.product_capabilities FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Allow admin update all capabilities" ON public.product_capabilities;
CREATE POLICY "Allow admin update all capabilities"
  ON public.product_capabilities FOR UPDATE TO authenticated
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

DROP POLICY IF EXISTS "Allow admin delete all capabilities" ON public.product_capabilities;
CREATE POLICY "Allow admin delete all capabilities"
  ON public.product_capabilities FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

-- 10. RLS Policies for product_technologies
DROP POLICY IF EXISTS "Allow public select of technologies" ON public.product_technologies;
CREATE POLICY "Allow public select of technologies"
  ON public.product_technologies FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.tools_products
      WHERE id = product_technologies.product_id
      AND status = 'published'
    )
  );

DROP POLICY IF EXISTS "Allow admin select all product technologies" ON public.product_technologies;
CREATE POLICY "Allow admin select all product technologies"
  ON public.product_technologies FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Allow admin insert all product technologies" ON public.product_technologies;
CREATE POLICY "Allow admin insert all product technologies"
  ON public.product_technologies FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Allow admin update all product technologies" ON public.product_technologies;
CREATE POLICY "Allow admin update all product technologies"
  ON public.product_technologies FOR UPDATE TO authenticated
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

DROP POLICY IF EXISTS "Allow admin delete all product technologies" ON public.product_technologies;
CREATE POLICY "Allow admin delete all product technologies"
  ON public.product_technologies FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

-- 11. Triggers
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_tools_products_updated_at ON public.tools_products;
CREATE TRIGGER update_tools_products_updated_at
  BEFORE UPDATE ON public.tools_products
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- 12. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('projects', 'projects', true),
  ('tools-products', 'tools-products', true)
ON CONFLICT (id) DO NOTHING;

-- 13. RLS Storage Policies for projects
DROP POLICY IF EXISTS "Allow public read of projects assets" ON storage.objects;
CREATE POLICY "Allow public read of projects assets"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'projects');

DROP POLICY IF EXISTS "Allow admin insert of projects assets" ON storage.objects;
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

DROP POLICY IF EXISTS "Allow admin update of projects assets" ON storage.objects;
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

DROP POLICY IF EXISTS "Allow admin delete of projects assets" ON storage.objects;
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

-- 14. RLS Storage Policies for tools-products
DROP POLICY IF EXISTS "Allow public read of tools products assets" ON storage.objects;
CREATE POLICY "Allow public read of tools products assets"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'tools-products');

DROP POLICY IF EXISTS "Allow admin insert of tools products assets" ON storage.objects;
CREATE POLICY "Allow admin insert of tools products assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'tools-products'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Allow admin update of tools products assets" ON storage.objects;
CREATE POLICY "Allow admin update of tools products assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'tools-products'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Allow admin delete of tools products assets" ON storage.objects;
CREATE POLICY "Allow admin delete of tools products assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'tools-products'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );
