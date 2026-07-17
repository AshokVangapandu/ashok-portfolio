-- Alter testimonials table to add deleted_at column for soft delete
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
