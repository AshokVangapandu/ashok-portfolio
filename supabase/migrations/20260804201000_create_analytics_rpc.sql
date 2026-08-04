-- Create format_time_ago helper function
CREATE OR REPLACE FUNCTION public.format_time_ago(ts TIMESTAMP WITH TIME ZONE)
RETURNS TEXT
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  diff INTERVAL;
  seconds INT;
  minutes INT;
  hours INT;
  days INT;
BEGIN
  diff := now() - ts;
  seconds := floor(extract(epoch from diff));
  
  IF seconds < 60 THEN
    RETURN 'Just now';
  END IF;
  
  minutes := seconds / 60;
  IF minutes < 60 THEN
    RETURN minutes || 'm ago';
  END IF;
  
  hours := minutes / 60;
  IF hours < 24 THEN
    RETURN hours || 'h ago';
  END IF;
  
  days := hours / 24;
  IF days = 1 THEN
    RETURN 'Yesterday';
  END IF;
  IF days < 7 THEN
    RETURN days || 'd ago';
  END IF;
  
  RETURN to_char(ts, 'Jan DD, YYYY');
END;
$$;

-- Helper to format duration_seconds into "Xm Ys"
CREATE OR REPLACE FUNCTION public.format_duration(seconds_val FLOAT)
RETURNS TEXT
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  minutes INT;
  seconds INT;
BEGIN
  IF seconds_val IS NULL OR seconds_val <= 0 THEN
    RETURN '0s';
  END IF;
  minutes := floor(seconds_val / 60);
  seconds := round(seconds_val::numeric % 60);
  IF minutes > 0 THEN
    RETURN minutes || 'm ' || seconds || 's';
  END IF;
  RETURN seconds || 's';
END;
$$;

-- Helper to get timerange start timestamps
CREATE OR REPLACE FUNCTION public.get_timerange_bounds(range_filter TEXT)
RETURNS TABLE (start_time TIMESTAMP WITH TIME ZONE, prev_start_time TIMESTAMP WITH TIME ZONE, now_time TIMESTAMP WITH TIME ZONE)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  nt TIMESTAMP WITH TIME ZONE := now();
  st TIMESTAMP WITH TIME ZONE;
  pst TIMESTAMP WITH TIME ZONE;
BEGIN
  IF range_filter = 'today' THEN
    st := date_trunc('day', nt);
    pst := st - interval '1 day';
  ELSIF range_filter = '7days' THEN
    st := nt - interval '7 days';
    pst := st - interval '7 days';
  ELSIF range_filter = '90days' THEN
    st := nt - interval '90 days';
    pst := st - interval '90 days';
  ELSE -- Default to '30days'
    st := nt - interval '30 days';
    pst := st - interval '30 days';
  END IF;
  
  RETURN QUERY SELECT st, pst, nt;
END;
$$;

-- Helper to format trend numbers
CREATE OR REPLACE FUNCTION public.calculate_trend_str(curr_val FLOAT, prev_val FLOAT)
RETURNS TEXT
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  pct FLOAT;
BEGIN
  IF prev_val IS NULL OR prev_val = 0 THEN
    IF curr_val > 0 THEN
      RETURN '+100.0%';
    ELSE
      RETURN '+0.0%';
    END IF;
  END IF;
  pct := ((curr_val - prev_val) / prev_val) * 100.0;
  IF pct >= 0 THEN
    RETURN '+' || to_char(pct, 'FM990.0') || '%';
  ELSE
    RETURN to_char(pct, 'FM990.0') || '%';
  END IF;
END;
$$;


-- 1. get_analytics_summary RPC
CREATE OR REPLACE FUNCTION public.get_analytics_summary(range_filter TEXT)
RETURNS JSONB
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  st TIMESTAMP WITH TIME ZONE;
  pst TIMESTAMP WITH TIME ZONE;
  nt TIMESTAMP WITH TIME ZONE;
  
  -- Current values
  curr_visitors INT := 0;
  curr_uniques INT := 0;
  curr_avg_time FLOAT := 0.0;
  curr_forms INT := 0;
  curr_testimonials INT := 0;
  
  -- Previous values
  prev_visitors INT := 0;
  prev_uniques INT := 0;
  prev_avg_time FLOAT := 0.0;
  prev_forms INT := 0;
  prev_testimonials INT := 0;
BEGIN
  -- Resolve bounds
  SELECT start_time, prev_start_time, now_time INTO st, pst, nt FROM public.get_timerange_bounds(range_filter);
  
  -- 1. Current aggregates
  SELECT COUNT(*), COUNT(DISTINCT visitor_id), COALESCE(AVG(duration_seconds), 0)
    INTO curr_visitors, curr_uniques, curr_avg_time
    FROM public.visitor_sessions
    WHERE created_at >= st AND created_at <= nt;
    
  SELECT COUNT(*) INTO curr_forms FROM public.contact_messages WHERE created_at >= st AND created_at <= nt;
  SELECT COUNT(*) INTO curr_testimonials FROM public.testimonials WHERE created_at >= st AND created_at <= nt;

  -- 2. Previous aggregates
  SELECT COUNT(*), COUNT(DISTINCT visitor_id), COALESCE(AVG(duration_seconds), 0)
    INTO prev_visitors, prev_uniques, prev_avg_time
    FROM public.visitor_sessions
    WHERE created_at >= pst AND created_at < st;
    
  SELECT COUNT(*) INTO prev_forms FROM public.contact_messages WHERE created_at >= pst AND created_at < st;
  SELECT COUNT(*) INTO prev_testimonials FROM public.testimonials WHERE created_at >= pst AND created_at < st;
  
  RETURN jsonb_build_object(
    'totalVisitors', curr_visitors,
    'uniqueVisitors', curr_uniques,
    'avgSessionTime', public.format_duration(curr_avg_time),
    'formSubmissions', curr_forms,
    'testimonialsCount', curr_testimonials,
    'trends', jsonb_build_object(
      'totalVisitors', public.calculate_trend_str(curr_visitors::float, prev_visitors::float),
      'uniqueVisitors', public.calculate_trend_str(curr_uniques::float, prev_uniques::float),
      'avgSessionTime', public.calculate_trend_str(curr_avg_time, prev_avg_time),
      'formSubmissions', public.calculate_trend_str(curr_forms::float, prev_forms::float),
      'testimonialsCount', public.calculate_trend_str(curr_testimonials::float, prev_testimonials::float)
    )
  );
END;
$$;


-- 2. get_analytics_trends RPC
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


-- 3. get_analytics_locations RPC
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
    'count', count,
    'percentage', ROUND((count::float / total_count * 100)::numeric, 0),
    'code', CASE COALESCE(country, 'Unknown')
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
  )) INTO res
  FROM (
    SELECT country, COUNT(*) as count
    FROM public.visitor_sessions
    WHERE created_at >= st AND created_at <= nt
    GROUP BY country
    ORDER BY count DESC
    LIMIT 6
  ) l;
  
  RETURN COALESCE(res, '[]'::jsonb);
END;
$$;


-- 4. get_analytics_sources RPC
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
    'rank', row_number() over (order by count desc),
    'source', traffic_source,
    'percentage', ROUND((count::float / total_count * 100)::numeric, 0),
    'type', CASE traffic_source
      WHEN 'LinkedIn' THEN 'linkedin'
      WHEN 'Google Search' THEN 'google'
      WHEN 'GitHub' THEN 'github'
      WHEN 'Direct' THEN 'direct'
      ELSE 'other'
    END
  )) INTO res
  FROM (
    SELECT COALESCE(traffic_source, 'Direct') as traffic_source, COUNT(*) as count
    FROM public.visitor_sessions
    WHERE created_at >= st AND created_at <= nt
    GROUP BY traffic_source
    ORDER BY count DESC
    LIMIT 5
  ) s;
  
  RETURN COALESCE(res, '[]'::jsonb);
END;
$$;


-- 5. get_analytics_devices RPC
CREATE OR REPLACE FUNCTION public.get_analytics_devices(range_filter TEXT)
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
    'name', device_type,
    'percentage', ROUND((count::float / total_count * 100)::numeric, 0)
  )) INTO res
  FROM (
    SELECT COALESCE(device_type, 'Desktop') as device_type, COUNT(*) as count
    FROM public.visitor_sessions
    WHERE created_at >= st AND created_at <= nt
    GROUP BY device_type
    ORDER BY count DESC
  ) d;
  
  RETURN COALESCE(res, '[]'::jsonb);
END;
$$;


-- 6. get_analytics_browsers RPC
CREATE OR REPLACE FUNCTION public.get_analytics_browsers(range_filter TEXT)
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
    'name', browser,
    'percentage', ROUND((count::float / total_count * 100)::numeric, 0)
  )) INTO res
  FROM (
    SELECT COALESCE(browser, 'Other') as browser, COUNT(*) as count
    FROM public.visitor_sessions
    WHERE created_at >= st AND created_at <= nt
    GROUP BY browser
    ORDER BY count DESC
    LIMIT 5
  ) b;
  
  RETURN COALESCE(res, '[]'::jsonb);
END;
$$;


-- 7. get_analytics_operating_systems RPC
CREATE OR REPLACE FUNCTION public.get_analytics_operating_systems(range_filter TEXT)
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
    'name', operating_system,
    'percentage', ROUND((count::float / total_count * 100)::numeric, 0)
  )) INTO res
  FROM (
    SELECT COALESCE(operating_system, 'Other') as operating_system, COUNT(*) as count
    FROM public.visitor_sessions
    WHERE created_at >= st AND created_at <= nt
    GROUP BY operating_system
    ORDER BY count DESC
    LIMIT 5
  ) o;
  
  RETURN COALESCE(res, '[]'::jsonb);
END;
$$;


-- 8. get_analytics_visitor_comparison RPC
CREATE OR REPLACE FUNCTION public.get_analytics_visitor_comparison(range_filter TEXT)
RETURNS JSONB
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  st TIMESTAMP WITH TIME ZONE;
  pst TIMESTAMP WITH TIME ZONE;
  nt TIMESTAMP WITH TIME ZONE;
  
  curr_total FLOAT := 0.0;
  curr_new FLOAT := 0.0;
  curr_returning FLOAT := 0.0;
  
  prev_total FLOAT := 0.0;
  prev_new FLOAT := 0.0;
  prev_returning FLOAT := 0.0;
BEGIN
  SELECT start_time, prev_start_time, now_time INTO st, pst, nt FROM public.get_timerange_bounds(range_filter);
  
  -- 1. Current counts
  SELECT COUNT(*)::float INTO curr_total FROM public.visitor_sessions WHERE created_at >= st AND created_at <= nt;
  
  SELECT COUNT(*)::float INTO curr_new
    FROM public.visitor_sessions v1
    WHERE v1.created_at >= st AND v1.created_at <= nt
    AND NOT EXISTS (
      SELECT 1 FROM public.visitor_sessions v2
      WHERE v2.visitor_id = v1.visitor_id
      AND v2.created_at < v1.created_at
    );
    
  curr_returning := curr_total - curr_new;
  
  -- 2. Previous counts
  SELECT COUNT(*)::float INTO prev_total FROM public.visitor_sessions WHERE created_at >= pst AND created_at < st;
  
  SELECT COUNT(*)::float INTO prev_new
    FROM public.visitor_sessions v1
    WHERE v1.created_at >= pst AND v1.created_at < st
    AND NOT EXISTS (
      SELECT 1 FROM public.visitor_sessions v2
      WHERE v2.visitor_id = v1.visitor_id
      AND v2.created_at < v1.created_at
    );
    
  prev_returning := prev_total - prev_new;
  
  IF curr_total = 0 THEN
    RETURN jsonb_build_object(
      'newPercentage', 50,
      'returningPercentage', 50,
      'newTrend', '+0.0%',
      'returningTrend', '+0.0%'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'newPercentage', ROUND((curr_new / curr_total * 100)::numeric, 0),
    'returningPercentage', ROUND((curr_returning / curr_total * 100)::numeric, 0),
    'newTrend', public.calculate_trend_str(curr_new, prev_new),
    'returningTrend', public.calculate_trend_str(curr_returning, prev_returning)
  );
END;
$$;


-- 9. get_analytics_peak_hours RPC
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
    'hour', replace(replace(to_char(g, 'fmhh12am'), 'am', 'a'), 'pm', 'p'),
    'value', ROUND((COALESCE(h.count, 0)::float / max_count::float * 10.0)::numeric, 0)
  )) INTO res
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
  ORDER BY hours.hr_val;
  
  RETURN COALESCE(res, '[]'::jsonb);
END;
$$;


-- 10. get_analytics_activities RPC
CREATE OR REPLACE FUNCTION public.get_analytics_activities(range_filter TEXT)
RETURNS JSONB
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  st TIMESTAMP WITH TIME ZONE;
  pst TIMESTAMP WITH TIME ZONE;
  nt TIMESTAMP WITH TIME ZONE;
  res JSONB;
BEGIN
  SELECT start_time, prev_start_time, now_time INTO st, pst, nt FROM public.get_timerange_bounds(range_filter);
  
  SELECT jsonb_agg(jsonb_build_object(
    'id', act.id,
    'type', act.type,
    'title', act.title,
    'subtitle', act.subtitle,
    'time', public.format_time_ago(act.event_time),
    'event_time', to_char(act.event_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
  )) INTO res
  FROM (
    -- 1. General page visits (first page viewed in session)
    SELECT 
      s.id as id,
      'visit'::text as type,
      'New visitor from ' || COALESCE(s.traffic_source, 'Direct') as title,
      COALESCE(s.city, 'Unknown') || ', ' || COALESCE(s.country, 'Unknown') as subtitle,
      s.created_at as event_time
    FROM public.visitor_sessions s
    WHERE s.created_at >= st AND s.created_at <= nt
    
    UNION ALL
    
    -- 2. Contact form submissions
    SELECT 
      m.id::text as id,
      'submission'::text as type,
      'Contact form submitted'::text as title,
      m.email as subtitle,
      m.created_at as event_time
    FROM public.contact_messages m
    WHERE m.created_at >= st AND m.created_at <= nt
    
    UNION ALL
    
    -- 3. Testimonials submitted
    SELECT 
      t.id::text as id,
      'testimonial'::text as type,
      'Testimonial received'::text as title,
      t.rating || ' stars - ' || t.full_name as subtitle,
      t.created_at as event_time
    FROM public.testimonials t
    WHERE t.created_at >= st AND t.created_at <= nt
    
    UNION ALL
    
    -- 4. Resume downloads
    SELECT 
      d.id::text as id,
      'download'::text as type,
      'Resume downloaded'::text as title,
      COALESCE(d.city, 'Unknown') || ', ' || COALESCE(d.country, 'Unknown') as subtitle,
      d.downloaded_at as event_time
    FROM public.resume_downloads d
    WHERE d.downloaded_at >= st AND d.downloaded_at <= nt
    
    UNION ALL
    
    -- 5. Project views (custom events)
    SELECT 
      e.id::text as id,
      'project'::text as type,
      (e.event_metadata->>'project_title') || ' viewed' as title,
      COALESCE(s.city, 'Unknown') || ', ' || COALESCE(s.country, 'Unknown') as subtitle,
      e.created_at as event_time
    FROM public.analytics_events e
    JOIN public.visitor_sessions s ON s.id = e.session_id
    WHERE e.event_type = 'project_view' 
    AND e.created_at >= st AND e.created_at <= nt

    ORDER BY event_time DESC
    LIMIT 20
  ) act;
  
  RETURN COALESCE(res, '[]'::jsonb);
END;
$$;
