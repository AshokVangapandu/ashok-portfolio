-- Alter testimonials table to add admin_notes column
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS admin_notes TEXT;
