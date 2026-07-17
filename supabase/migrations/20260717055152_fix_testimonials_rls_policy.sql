-- Drop the old public insert policy
DROP POLICY IF EXISTS "Allow public insert of pending testimonials" ON public.testimonials;

-- Recreate it with checking is_visible = FALSE to match our form submission defaults
CREATE POLICY "Allow public insert of pending testimonials"
  ON public.testimonials FOR INSERT TO public
  WITH CHECK (status = 'pending' AND featured = FALSE AND is_visible = FALSE);
