-- Update get_analytics_sources RPC to utilize normalized traffic_source and traffic_source_display
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
      row_number() over (order by count desc) as rank,
      traffic_source_display,
      ROUND((count::float / total_count * 100)::numeric, 0) as percentage,
      CASE traffic_source
        WHEN 'linkedin' THEN 'linkedin'
        WHEN 'google' THEN 'google'
        WHEN 'github' THEN 'github'
        WHEN 'direct' THEN 'direct'
        ELSE 'other'
      END as type
    FROM (
      SELECT 
        COALESCE(traffic_source, 'direct') as traffic_source, 
        COALESCE(traffic_source_display, 'Direct') as traffic_source_display, 
        COUNT(*) as count
      FROM public.visitor_sessions
      WHERE created_at >= st AND created_at <= nt
      GROUP BY traffic_source, traffic_source_display
      ORDER BY count DESC
      LIMIT 5
    ) inner_s
  ) s;
  
  RETURN COALESCE(res, '[]'::jsonb);
END;
$$;
