-- Alter testimonials table to add audit fields
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS approved_by TEXT DEFAULT NULL;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS rejected_by TEXT DEFAULT NULL;
