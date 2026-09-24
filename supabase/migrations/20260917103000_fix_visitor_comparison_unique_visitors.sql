-- Migration: 20260917103000_fix_visitor_comparison_unique_visitors.sql
-- Description: Updates get_analytics_visitor_comparison to calculate true UNIQUE VISITOR level metrics (new vs returning)

-- 1. Create composite index on public.visitor_sessions (visitor_id, created_at) for efficient lifecycle lookup
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_vid_created 
ON public.visitor_sessions(visitor_id, created_at ASC);

-- 2. Update get_analytics_visitor_comparison RPC
CREATE OR REPLACE FUNCTION public.get_analytics_visitor_comparison(range_filter TEXT)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  nt TIMESTAMP WITH TIME ZONE := now();
  st TIMESTAMP WITH TIME ZONE;
  pst TIMESTAMP WITH TIME ZONE;
  pet TIMESTAMP WITH TIME ZONE;
  
  -- Current period metrics
  curr_total INT := 0;
  curr_new INT := 0;
  curr_returning INT := 0;
  curr_new_pct INT := 0;
  curr_ret_pct INT := 0;
  
  -- Previous period metrics
  prev_new INT := 0;
  prev_returning INT := 0;
  
  -- Trend strings
  new_trend_str TEXT := '+0.0%';
  ret_trend_str TEXT := '+0.0%';
  
  delta_ret NUMERIC;
  delta_new NUMERIC;
BEGIN
  -- 1. Security Check: Restrict execution from unauthorized public/anonymous calls
  IF auth.role() = 'anon' THEN
    RAISE EXCEPTION 'Access denied: Anonymous users cannot access analytics metrics.';
  END IF;

  -- 2. Calculate timezone-aware period bounds
  -- Target project analytics timezone: Asia/Kolkata
  IF range_filter = 'today' THEN
    -- Start of today in Asia/Kolkata converted to timestamptz
    st := (date_trunc('day', nt AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'Asia/Kolkata');
    pst := st - interval '1 day';
    -- Compare equivalent elapsed time today vs yesterday
    pet := pst + (nt - st);
  ELSIF range_filter = '7days' THEN
    st := nt - interval '7 days';
    pst := st - interval '7 days';
    pet := st;
  ELSIF range_filter = '90days' THEN
    st := nt - interval '90 days';
    pst := st - interval '90 days';
    pet := st;
  ELSE -- Default to '30days'
    st := nt - interval '30 days';
    pst := st - interval '30 days';
    pet := st;
  END IF;

  -- 3. Aggregate CURRENT PERIOD unique visitors
  WITH curr_active_visitors AS (
    SELECT DISTINCT visitor_id
    FROM public.visitor_sessions
    WHERE created_at >= st AND created_at <= nt
  ),
  curr_classified AS (
    SELECT 
      cav.visitor_id,
      EXISTS (
        SELECT 1 
        FROM public.visitor_sessions prior
        WHERE prior.visitor_id = cav.visitor_id
          AND prior.created_at < st
      ) AS is_returning
    FROM curr_active_visitors cav
  )
  SELECT 
    COUNT(*)::INT,
    COALESCE(COUNT(*) FILTER (WHERE NOT is_returning), 0)::INT,
    COALESCE(COUNT(*) FILTER (WHERE is_returning), 0)::INT
  INTO curr_total, curr_new, curr_returning
  FROM curr_classified;

  -- 4. Aggregate PREVIOUS PERIOD unique visitors
  WITH prev_active_visitors AS (
    SELECT DISTINCT visitor_id
    FROM public.visitor_sessions
    WHERE created_at >= pst AND created_at <= pet
  ),
  prev_classified AS (
    SELECT 
      pav.visitor_id,
      EXISTS (
        SELECT 1 
        FROM public.visitor_sessions prior
        WHERE prior.visitor_id = pav.visitor_id
          AND prior.created_at < pst
      ) AS is_returning
    FROM prev_active_visitors pav
  )
  SELECT 
    COALESCE(COUNT(*) FILTER (WHERE NOT is_returning), 0)::INT,
    COALESCE(COUNT(*) FILTER (WHERE is_returning), 0)::INT
  INTO prev_new, prev_returning
  FROM prev_classified;

  -- 5. Calculate integer percentages with zero drift
  IF curr_total > 0 THEN
    curr_new_pct := ROUND((curr_new::NUMERIC / curr_total::NUMERIC) * 100.0, 0)::INT;
    curr_ret_pct := 100 - curr_new_pct;
  ELSE
    curr_new_pct := 0;
    curr_ret_pct := 0;
  END IF;

  -- 6. Calculate RETURNING VISITORS trend
  IF prev_returning = 0 THEN
    IF curr_returning > 0 THEN
      ret_trend_str := '—'; -- No previous baseline
    ELSE
      ret_trend_str := '+0.0%';
    END IF;
  ELSE
    delta_ret := ((curr_returning - prev_returning)::NUMERIC / prev_returning::NUMERIC) * 100.0;
    IF delta_ret >= 0 THEN
      ret_trend_str := '+' || to_char(delta_ret, 'FM999990.0') || '%';
    ELSE
      ret_trend_str := to_char(delta_ret, 'FM999990.0') || '%';
    END IF;
  END IF;

  -- 7. Calculate NEW VISITORS trend
  IF prev_new = 0 THEN
    IF curr_new > 0 THEN
      new_trend_str := '—'; -- No previous baseline
    ELSE
      new_trend_str := '+0.0%';
    END IF;
  ELSE
    delta_new := ((curr_new - prev_new)::NUMERIC / prev_new::NUMERIC) * 100.0;
    IF delta_new >= 0 THEN
      new_trend_str := '+' || to_char(delta_new, 'FM999990.0') || '%';
    ELSE
      new_trend_str := to_char(delta_new, 'FM999990.0') || '%';
    END IF;
  END IF;

  -- 8. Return complete visitor-level contract
  RETURN jsonb_build_object(
    'totalUniqueVisitors', curr_total,
    'newVisitors', curr_new,
    'returningVisitors', curr_returning,
    'newPercentage', curr_new_pct,
    'returningPercentage', curr_ret_pct,
    'newTrend', new_trend_str,
    'returningTrend', ret_trend_str
  );
END;
$$;

-- 3. Restrict RPC Execution Permissions
REVOKE ALL ON FUNCTION public.get_analytics_visitor_comparison(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_analytics_visitor_comparison(TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_analytics_visitor_comparison(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_analytics_visitor_comparison(TEXT) TO service_role;
