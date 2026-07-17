-- Alter testimonials table to add user_id column
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS user_id UUID;
