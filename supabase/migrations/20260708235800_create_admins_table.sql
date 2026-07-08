-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comments on table columns for database documentation
COMMENT ON TABLE public.admins IS 'Administrative users registry for role-based authorization control.';
COMMENT ON COLUMN public.admins.id IS 'Primary key UUID generated automatically.';
COMMENT ON COLUMN public.admins.email IS 'Unique, case-sensitive email address of the administrator.';
COMMENT ON COLUMN public.admins.full_name IS 'Full display name of the administrator.';
COMMENT ON COLUMN public.admins.role IS 'Privilege tier (e.g., admin, super_admin).';
COMMENT ON COLUMN public.admins.is_active IS 'Status flag to temporarily revoke access if set to false.';

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create secure SELECT policy (only authenticated users can read their own row)
CREATE POLICY "Allow authenticated users to read their own admin record" 
ON public.admins 
FOR SELECT 
TO authenticated 
USING (auth.jwt() ->> 'email' = email);

-- Insert the initial administrator (using ON CONFLICT DO UPDATE to ensure re-runnability)
INSERT INTO public.admins (email, full_name, role, is_active)
VALUES (
    'ashokvangapandu45@gmail.com',
    'Ashok Vangapandu',
    'super_admin',
    true
)
ON CONFLICT (email) 
DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active;
