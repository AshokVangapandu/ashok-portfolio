-- Alter testimonials table to make display_order nullable, and configure defaults
ALTER TABLE public.testimonials ALTER COLUMN display_order DROP NOT NULL;
ALTER TABLE public.testimonials ALTER COLUMN display_order SET DEFAULT NULL;
ALTER TABLE public.testimonials ALTER COLUMN rating SET DEFAULT 5;
ALTER TABLE public.testimonials ALTER COLUMN is_visible SET DEFAULT FALSE;
