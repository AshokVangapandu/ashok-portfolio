-- Create email-assets public bucket in Supabase storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'email-assets',
  'email-assets',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

-- RLS Policy: Public can view objects in email-assets bucket
DROP POLICY IF EXISTS "Public select email assets" ON storage.objects;
CREATE POLICY "Public select email assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'email-assets');

-- RLS Policy: Authenticated/Admins or Service role can upload/manage email assets
DROP POLICY IF EXISTS "Allow service and admins upload email assets" ON storage.objects;
CREATE POLICY "Allow service and admins upload email assets"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'email-assets')
WITH CHECK (bucket_id = 'email-assets');
