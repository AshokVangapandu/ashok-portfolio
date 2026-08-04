-- Add attribution columns to public.visitor_sessions
ALTER TABLE public.visitor_sessions
ADD COLUMN IF NOT EXISTS traffic_medium TEXT,
ADD COLUMN IF NOT EXISTS traffic_campaign TEXT,
ADD COLUMN IF NOT EXISTS traffic_content TEXT,
ADD COLUMN IF NOT EXISTS traffic_term TEXT,
ADD COLUMN IF NOT EXISTS referrer_url TEXT,
ADD COLUMN IF NOT EXISTS attribution_type TEXT;
