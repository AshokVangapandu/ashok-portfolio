-- Drop the existing policies checking JWT app_metadata
DROP POLICY IF EXISTS "Allow admin select" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admin update" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admin delete" ON public.contact_messages;

-- Create secure SELECT policy (validates authenticated user's email against public.admins)
CREATE POLICY "Allow admin select"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE email = (SELECT auth.jwt() ->> 'email')
    AND is_active = true
  )
);

-- Create secure UPDATE policy
CREATE POLICY "Allow admin update"
ON public.contact_messages
FOR UPDATE
TO authenticated
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

-- Create secure DELETE policy
CREATE POLICY "Allow admin delete"
ON public.contact_messages
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE email = (SELECT auth.jwt() ->> 'email')
    AND is_active = true
  )
);
