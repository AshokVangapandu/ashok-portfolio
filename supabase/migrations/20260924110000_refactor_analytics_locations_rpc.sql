-- Migration: Refactor get_analytics_locations RPC to calculate exact Top 3 + Combined Others
CREATE OR REPLACE FUNCTION public.get_analytics_locations(range_filter TEXT)
RETURNS JSONB
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  st TIMESTAMP WITH TIME ZONE;
  pst TIMESTAMP WITH TIME ZONE;
  nt TIMESTAMP WITH TIME ZONE;
  total_count INT := 0;
  top_sum INT := 0;
  top_pct_sum INT := 0;
  others_count INT := 0;
  others_pct INT := 0;
  res JSONB := '[]'::jsonb;
  item RECORD;
BEGIN
  SELECT start_time, prev_start_time, now_time INTO st, pst, nt FROM public.get_timerange_bounds(range_filter);
  
  -- Total visits in range
  SELECT COUNT(*)::int INTO total_count 
  FROM public.visitor_sessions 
  WHERE created_at >= st AND created_at <= nt;
  
  IF total_count = 0 THEN
    RETURN '[]'::jsonb;
  END IF;

  -- Iterate through Top 3 resolved (known) countries
  FOR item IN (
    SELECT 
      country,
      COALESCE(MAX(country_code), CASE country
        WHEN 'United States' THEN 'US'
        WHEN 'India' THEN 'IN'
        WHEN 'Germany' THEN 'DE'
        WHEN 'United Kingdom' THEN 'GB'
        WHEN 'Canada' THEN 'CA'
        WHEN 'Singapore' THEN 'SG'
        WHEN 'South Korea' THEN 'KR'
        WHEN 'Spain' THEN 'ES'
        WHEN 'Denmark' THEN 'DK'
        WHEN 'France' THEN 'FR'
        WHEN 'Australia' THEN 'AU'
        WHEN 'Japan' THEN 'JP'
        ELSE 'GLOBE'
      END) AS country_code,
      COUNT(*)::int AS count,
      ROUND((COUNT(*)::float / total_count * 100)::numeric, 0)::int AS percentage,
      COALESCE(jsonb_agg(DISTINCT city) FILTER (WHERE city IS NOT NULL AND city != 'Unknown' AND city != ''), '[]'::jsonb) AS cities
    FROM (
      SELECT 
        CASE 
          WHEN country IS NULL OR trim(country) = '' OR lower(trim(country)) IN ('unknown', 'unresolved') THEN NULL
          ELSE trim(country)
        END AS country,
        country_code,
        city
      FROM public.visitor_sessions
      WHERE created_at >= st AND created_at <= nt
    ) s
    WHERE country IS NOT NULL
    GROUP BY country
    ORDER BY count DESC, country ASC
    LIMIT 3
  ) LOOP
    top_sum := top_sum + item.count;
    top_pct_sum := top_pct_sum + item.percentage;
    res := res || jsonb_build_array(jsonb_build_object(
      'country', item.country,
      'countryCode', item.country_code,
      'count', item.count,
      'percentage', item.percentage,
      'cities', item.cities,
      'isOthers', false
    ));
  END LOOP;

  -- Compute Others: includes all 4th+ countries plus all unresolved/unknown sessions
  others_count := total_count - top_sum;
  IF others_count > 0 THEN
    others_pct := GREATEST(0, 100 - top_pct_sum);
  ELSE
    others_pct := 0;
  END IF;

  res := res || jsonb_build_array(jsonb_build_object(
    'country', 'Others',
    'countryCode', '',
    'count', others_count,
    'percentage', others_pct,
    'cities', '[]'::jsonb,
    'isOthers', true
  ));

  RETURN res;
END;
$$;
