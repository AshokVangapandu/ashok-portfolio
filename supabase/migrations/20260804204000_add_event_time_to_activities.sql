-- Update get_analytics_activities RPC to return event_time UTC ISO string
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
