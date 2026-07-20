-- Fix SELECT RLS policy on public.admins to allow public/authenticated read of admin status without recursion
DROP POLICY IF EXISTS "Allow active admins to select all admin records" ON public.admins;
DROP POLICY IF EXISTS "Allow public select of admins" ON public.admins;

CREATE POLICY "Allow public select of admins"
  ON public.admins FOR SELECT TO public
  USING (true);
