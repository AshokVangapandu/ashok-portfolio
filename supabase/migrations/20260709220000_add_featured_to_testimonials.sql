-- Add featured column to testimonials if it doesn't already exist
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE;

-- Create an index to optimize featured queries
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials(featured);
