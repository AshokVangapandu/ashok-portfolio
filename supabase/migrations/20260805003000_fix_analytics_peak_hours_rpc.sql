-- Fix get_analytics_peak_hours RPC syntax error
CREATE OR REPLACE FUNCTION public.get_analytics_peak_hours(range_filter TEXT)
RETURNS JSONB
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  st TIMESTAMP WITH TIME ZONE;
  pst TIMESTAMP WITH TIME ZONE;
  nt TIMESTAMP WITH TIME ZONE;
  max_count INT := 0;
  res JSONB;
BEGIN
  SELECT start_time, prev_start_time, now_time INTO st, pst, nt FROM public.get_timerange_bounds(range_filter);
  
  -- Find max count in any hour to scale 0-10
  SELECT COALESCE(MAX(count), 0) INTO max_count
  FROM (
    SELECT EXTRACT(hour FROM created_at) as hr, COUNT(*) as count
    FROM public.visitor_sessions
    WHERE created_at >= st AND created_at <= nt
    GROUP BY hr
  ) hr_counts;
  
  IF max_count = 0 THEN
    max_count := 1;
  END IF;
  
  SELECT jsonb_agg(jsonb_build_object(
    'hour', replace(replace(to_char(d.g, 'fmhh12am'), 'am', 'a'), 'pm', 'p'),
    'value', ROUND((COALESCE(d.count, 0)::float / max_count::float * 10.0)::numeric, 0)
  ) ORDER BY d.hr_val) INTO res
  FROM (
    SELECT hours.hr_val, h.count, format_helper.g
    FROM (
      SELECT generate_series(0, 23) as hr_val
    ) hours
    LEFT JOIN LATERAL (
      SELECT COUNT(*) as count
      FROM public.visitor_sessions
      WHERE created_at >= st AND created_at <= nt
      AND EXTRACT(hour FROM created_at) = hours.hr_val
    ) h ON true
    CROSS JOIN LATERAL (
      -- create a full helper timestamp for formatting
      SELECT make_timestamptz(2000, 1, 1, hours.hr_val, 0, 0.0, 'UTC') as g
    ) format_helper
  ) d;
  
  RETURN COALESCE(res, '[]'::jsonb);
END;
$$;
