-- Update get_analytics_locations RPC to return hierarchical country and city data
CREATE OR REPLACE FUNCTION public.get_analytics_locations(range_filter TEXT)
RETURNS JSONB
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  st TIMESTAMP WITH TIME ZONE;
  pst TIMESTAMP WITH TIME ZONE;
  nt TIMESTAMP WITH TIME ZONE;
  total_count FLOAT := 0.0;
  res JSONB;
BEGIN
  SELECT start_time, prev_start_time, now_time INTO st, pst, nt FROM public.get_timerange_bounds(range_filter);
  
  SELECT COUNT(*)::float INTO total_count FROM public.visitor_sessions WHERE created_at >= st AND created_at <= nt;
  
  IF total_count = 0 THEN
    total_count := 1.0;
  END IF;
  
  SELECT jsonb_agg(jsonb_build_object(
    'country', COALESCE(country, 'Unknown'),
    'countryCode', COALESCE(country_code, CASE COALESCE(country, 'Unknown')
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
    END),
    'percentage', ROUND((count::float / total_count * 100)::numeric, 0),
    'count', count,
    'cities', COALESCE(cities, '[]'::jsonb)
  )) INTO res
  FROM (
    SELECT 
      country,
      MAX(country_code) as country_code,
      COUNT(*) as count,
      jsonb_agg(DISTINCT city) FILTER (WHERE city IS NOT NULL AND city != 'Unknown' AND city != '') as cities
    FROM public.visitor_sessions
    WHERE created_at >= st AND created_at <= nt
    GROUP BY country
    ORDER BY count DESC
    LIMIT 6
  ) l;
  
  RETURN COALESCE(res, '[]'::jsonb);
END;
$$;
