-- Add traffic_source_display column to public.visitor_sessions
ALTER TABLE public.visitor_sessions
ADD COLUMN IF NOT EXISTS traffic_source_display TEXT;
