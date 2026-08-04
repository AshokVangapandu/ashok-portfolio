-- Add country_code column to public.visitor_sessions
ALTER TABLE public.visitor_sessions
ADD COLUMN IF NOT EXISTS country_code TEXT;

-- Backfill country_code based on existing country values
UPDATE public.visitor_sessions
SET country_code = 
  CASE COALESCE(country, 'Unknown')
    WHEN 'United States' THEN 'US'
    WHEN 'India' THEN 'IN'
    WHEN 'Germany' THEN 'DE'
    WHEN 'United Kingdom' THEN 'GB'
    WHEN 'Canada' THEN 'CA'
    WHEN 'Singapore' THEN 'SG'
    WHEN 'South Korea' THEN 'KR'
    WHEN 'Spain' THEN 'ES'
    WHEN 'Denmark' THEN 'DK'
    ELSE 'GLOBE'
  END
WHERE country_code IS NULL;
