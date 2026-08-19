-- Return local-time peak hour analytics with both heatmap intensity and raw visit counts.
-- Keeps the existing one-argument RPC contract used by the admin dashboard.
CREATE OR REPLACE FUNCTION public.get_analytics_peak_hours(range_filter TEXT)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  analytics_timezone TEXT := 'Asia/Kolkata';
  st TIMESTAMP WITH TIME ZONE;
  nt TIMESTAMP WITH TIME ZONE := now();
  max_count INT := 0;
  res JSONB;
BEGIN
  IF range_filter = 'today' THEN
    st := date_trunc('day', nt AT TIME ZONE analytics_timezone) AT TIME ZONE analytics_timezone;
  ELSIF range_filter = '7days' THEN
    st := nt - interval '7 days';
  ELSIF range_filter = '90days' THEN
    st := nt - interval '90 days';
  ELSE
    st := nt - interval '30 days';
  END IF;

  WITH hour_counts AS (
    SELECT
      EXTRACT(hour FROM created_at AT TIME ZONE analytics_timezone)::INT AS hour_value,
      COUNT(*)::INT AS visit_count
    FROM public.visitor_sessions
    WHERE created_at >= st AND created_at <= nt
    GROUP BY hour_value
  )
  SELECT COALESCE(MAX(visit_count), 0)
  INTO max_count
  FROM hour_counts;

  WITH hours AS (
    SELECT generate_series(0, 23)::INT AS hour_value
  ),
  hour_counts AS (
    SELECT
      EXTRACT(hour FROM created_at AT TIME ZONE analytics_timezone)::INT AS hour_value,
      COUNT(*)::INT AS visit_count
    FROM public.visitor_sessions
    WHERE created_at >= st AND created_at <= nt
    GROUP BY hour_value
  ),
  normalized AS (
    SELECT
      h.hour_value,
      COALESCE(hc.visit_count, 0)::INT AS visit_count,
      CASE
        WHEN max_count <= 0 THEN 0
        ELSE ROUND((COALESCE(hc.visit_count, 0)::FLOAT / max_count::FLOAT * 10.0)::NUMERIC, 0)::INT
      END AS intensity
    FROM hours h
    LEFT JOIN hour_counts hc ON hc.hour_value = h.hour_value
  )
  SELECT jsonb_agg(
    jsonb_build_object(
      'hour', LOWER(REPLACE(REPLACE(to_char(make_timestamp(2000, 1, 1, n.hour_value, 0, 0), 'FMHH12AM'), 'AM', 'a'), 'PM', 'p')),
      'label', REPLACE(REPLACE(to_char(make_timestamp(2000, 1, 1, n.hour_value, 0, 0), 'FMHH12 AM'), 'AM', 'AM'), 'PM', 'PM'),
      'value', n.intensity,
      'count', n.visit_count,
      'timezone', analytics_timezone
    )
    ORDER BY n.hour_value
  )
  INTO res
  FROM normalized n;

  RETURN COALESCE(res, '[]'::jsonb);
END;
$$;
