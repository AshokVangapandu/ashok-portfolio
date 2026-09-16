-- Unify and consolidate traffic source grouping in get_analytics_sources RPC
CREATE OR REPLACE FUNCTION public.get_analytics_sources(range_filter TEXT)
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
    'rank', rank,
    'source', traffic_source_display,
    'percentage', percentage,
    'type', type
  )) INTO res
  FROM (
    SELECT 
      row_number() OVER (ORDER BY count DESC) AS rank,
      traffic_source_display,
      ROUND((count::float / total_count * 100)::numeric, 0) AS percentage,
      type
    FROM (
      SELECT 
        clean_display AS traffic_source_display,
        CASE 
          WHEN LOWER(clean_display) = 'direct' THEN 'direct'
          WHEN LOWER(clean_display) ILIKE '%linkedin%' THEN 'linkedin'
          WHEN LOWER(clean_display) ILIKE '%google%' THEN 'google'
          WHEN LOWER(clean_display) ILIKE '%github%' THEN 'github'
          ELSE COALESCE(MIN(clean_type), 'other')
        END AS type,
        COUNT(*) AS count
      FROM (
        SELECT 
          CASE 
            WHEN COALESCE(TRIM(traffic_source_display), '') = '' OR LOWER(TRIM(traffic_source_display)) = 'direct' OR LOWER(COALESCE(TRIM(traffic_source), '')) = 'direct' THEN 'Direct'
            ELSE TRIM(traffic_source_display)
          END AS clean_display,
          CASE 
            WHEN LOWER(COALESCE(TRIM(traffic_source), '')) IN ('linkedin', 'google', 'github', 'direct') THEN LOWER(TRIM(traffic_source))
            ELSE 'other'
          END AS clean_type
        FROM public.visitor_sessions
        WHERE created_at >= st AND created_at <= nt
      ) sub
      GROUP BY clean_display
      ORDER BY count DESC
      LIMIT 5
    ) inner_s
  ) s;
  
  RETURN COALESCE(res, '[]'::jsonb);
END;
$$;
