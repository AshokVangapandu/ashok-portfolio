-- Fix date boundaries and join constraints in get_analytics_trends RPC
CREATE OR REPLACE FUNCTION public.get_analytics_trends(range_filter TEXT, trend_mode TEXT)
RETURNS JSONB
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  st TIMESTAMP WITH TIME ZONE;
  pst TIMESTAMP WITH TIME ZONE;
  nt TIMESTAMP WITH TIME ZONE;
  res JSONB;
-- 
-- The database aggregation generates series elements truncated to clean calendar bounds
-- and performs LEFT JOIN filters strictly within the range bounds [st, nt].
-- This ensures total visitor counts remain 100% consistent across KPI stat summaries.
-- 
BEGIN
  SELECT start_time, prev_start_time, now_time INTO st, pst, nt FROM public.get_timerange_bounds(range_filter);
  
  IF trend_mode = 'weekly' THEN
    -- Group by week starting date
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
      'label', t.label,
      'visitors', t.visitors
    )), '[]'::jsonb) INTO res
    FROM (
      SELECT 
        'Wk ' || row_number() over (order by w.week_date) as label,
        COALESCE(COUNT(v.id), 0)::int as visitors
      FROM (
        SELECT generate_series(date_trunc('week', st), date_trunc('week', nt), interval '1 week') as week_date
      ) w
      LEFT JOIN public.visitor_sessions v ON 
        date_trunc('week', v.created_at) = w.week_date
        AND v.created_at >= st 
        AND v.created_at <= nt
      GROUP BY w.week_date
      ORDER BY w.week_date
    ) t;
    
  ELSIF trend_mode = 'monthly' THEN
    -- Group by month
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
      'label', t.label,
      'visitors', t.visitors
    )), '[]'::jsonb) INTO res
    FROM (
      SELECT 
        to_char(m.month_date, 'Mon') as label,
        COALESCE(COUNT(v.id), 0)::int as visitors
      FROM (
        SELECT generate_series(date_trunc('month', st), date_trunc('month', nt), interval '1 month') as month_date
      ) m
      LEFT JOIN public.visitor_sessions v ON 
        date_trunc('month', v.created_at) = m.month_date
        AND v.created_at >= st 
        AND v.created_at <= nt
      GROUP BY m.month_date
      ORDER BY m.month_date
    ) t;
    
  ELSE -- Daily
    IF range_filter = 'today' THEN
      -- Group by hour
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'label', t.label,
        'visitors', t.visitors
      )), '[]'::jsonb) INTO res
      FROM (
        SELECT 
          replace(replace(to_char(h.hour_date, 'fmhh12am'), 'am', 'a'), 'pm', 'p') as label,
          COALESCE(COUNT(v.id), 0)::int as visitors
        FROM (
          SELECT generate_series(date_trunc('hour', st), date_trunc('hour', nt), interval '1 hour') as hour_date
        ) h
        LEFT JOIN public.visitor_sessions v ON 
          date_trunc('hour', v.created_at) = h.hour_date
          AND v.created_at >= st 
          AND v.created_at <= nt
        GROUP BY h.hour_date
        ORDER BY h.hour_date
      ) t;
    ELSE
      -- Group by day
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'label', t.label,
        'visitors', t.visitors
      )), '[]'::jsonb) INTO res
      FROM (
        SELECT 
          CASE WHEN range_filter = '7days' THEN to_char(d.day_date, 'Dy') ELSE to_char(d.day_date, 'Mon DD') END as label,
          COALESCE(COUNT(v.id), 0)::int as visitors
        FROM (
          SELECT generate_series(date_trunc('day', st), date_trunc('day', nt), interval '1 day') as day_date
        ) d
        LEFT JOIN public.visitor_sessions v ON 
          date_trunc('day', v.created_at) = d.day_date
          AND v.created_at >= st 
          AND v.created_at <= nt
        GROUP BY d.day_date
        ORDER BY d.day_date
      ) t;
    END IF;
  END IF;
  
  RETURN COALESCE(res, '[]'::jsonb);
END;
$$;
