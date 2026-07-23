-- Create tools_products table
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

-- Create product_capabilities normalized repeater table
CREATE TABLE IF NOT EXISTS public.product_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.tools_products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create product_technologies normalized repeater table
CREATE TABLE IF NOT EXISTS public.product_technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.tools_products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tools_products_status ON public.tools_products (status, is_featured DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_capabilities_product_id ON public.product_capabilities (product_id, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_technologies_product_id ON public.product_technologies (product_id, display_order ASC);

-- Enable Row-Level Security
ALTER TABLE public.tools_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_technologies ENABLE ROW LEVEL SECURITY;

-- 1. SELECT POLICIES: Public read for published items
CREATE POLICY "Allow public select of published products"
  ON public.tools_products FOR SELECT TO public
  USING (status = 'published');

CREATE POLICY "Allow public select of capabilities"
  ON public.product_capabilities FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.tools_products
      WHERE id = product_capabilities.product_id
      AND status = 'published'
    )
  );

CREATE POLICY "Allow public select of technologies"
  ON public.product_technologies FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.tools_products
      WHERE id = product_technologies.product_id
      AND status = 'published'
    )
  );

-- 2. ADMIN POLICIES: Full CRUD for authenticated admins
-- tools_products admin policies
CREATE POLICY "Allow admin select all products"
  ON public.tools_products FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin insert all products"
  ON public.tools_products FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

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

CREATE POLICY "Allow admin delete all products"
  ON public.tools_products FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

-- product_capabilities admin policies
CREATE POLICY "Allow admin select all capabilities"
  ON public.product_capabilities FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin insert all capabilities"
  ON public.product_capabilities FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

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

CREATE POLICY "Allow admin delete all capabilities"
  ON public.product_capabilities FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

-- product_technologies admin policies
CREATE POLICY "Allow admin select all product technologies"
  ON public.product_technologies FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

CREATE POLICY "Allow admin insert all product technologies"
  ON public.product_technologies FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

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

CREATE POLICY "Allow admin delete all product technologies"
  ON public.product_technologies FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT auth.jwt() ->> 'email')
      AND is_active = true
    )
  );

-- Auto updated_at Trigger
CREATE TRIGGER update_tools_products_updated_at
  BEFORE UPDATE ON public.tools_products
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Create tools-products storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('tools-products', 'tools-products', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for tools-products storage bucket
CREATE POLICY "Allow public read of tools products assets"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'tools-products');

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
