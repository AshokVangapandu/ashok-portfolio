-- Add invitation_accepted_at tracking column to public.admins table
ALTER TABLE public.admins 
  ADD COLUMN IF NOT EXISTS invitation_accepted_at TIMESTAMPTZ;
