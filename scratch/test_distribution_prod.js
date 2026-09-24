/* scratch/test_distribution_prod.js */
const { Client } = require('pg');

const prodConfig = {
  connectionString: 'postgresql://postgres.txoszrnjkrlbjzpjisvp:Asher@4tyfive@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
};

const migrationSql = `
-- 1. get_analytics_devices
CREATE OR REPLACE FUNCTION public.get_analytics_devices(range_filter TEXT)
RETURNS JSONB
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  st TIMESTAMP WITH TIME ZONE;
  pst TIMESTAMP WITH TIME ZONE;
  nt TIMESTAMP WITH TIME ZONE;
  total_count INT := 0;
  res JSONB;
BEGIN
  SELECT start_time, prev_start_time, now_time INTO st, pst, nt FROM public.get_timerange_bounds(range_filter);
  
  SELECT COUNT(*) INTO total_count FROM public.visitor_sessions WHERE created_at >= st AND created_at <= nt;
  
  IF total_count = 0 THEN
    RETURN '[]'::jsonb;
  END IF;
  
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'name', device_type,
    'count', count,
    'percentage', ROUND(((count::numeric / total_count::numeric) * 100)::numeric, 0)
  ) ORDER BY count DESC), '[]'::jsonb) INTO res
  FROM (
    SELECT 
      CASE 
        WHEN COALESCE(TRIM(device_type), '') = '' THEN 'Desktop'
        ELSE INITCAP(TRIM(device_type))
      END as device_type,
      COUNT(*)::INT as count
    FROM public.visitor_sessions
    WHERE created_at >= st AND created_at <= nt
    GROUP BY 1
  ) d;
  
  RETURN COALESCE(res, '[]'::jsonb);
END;
$$;


-- 2. get_analytics_browsers
CREATE OR REPLACE FUNCTION public.get_analytics_browsers(range_filter TEXT)
RETURNS JSONB
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  st TIMESTAMP WITH TIME ZONE;
  pst TIMESTAMP WITH TIME ZONE;
  nt TIMESTAMP WITH TIME ZONE;
  total_count INT := 0;
  top_count_sum INT := 0;
  others_count INT := 0;
  top_browsers JSONB;
  res JSONB;
BEGIN
  SELECT start_time, prev_start_time, now_time INTO st, pst, nt FROM public.get_timerange_bounds(range_filter);
  
  SELECT COUNT(*) INTO total_count FROM public.visitor_sessions WHERE created_at >= st AND created_at <= nt;
  
  IF total_count = 0 THEN
    RETURN '[]'::jsonb;
  END IF;

  WITH grouped_browsers AS (
    SELECT 
      CASE 
        WHEN COALESCE(TRIM(browser), '') = '' OR LOWER(TRIM(browser)) = 'other' THEN 'Other'
        WHEN LOWER(TRIM(browser)) = 'chrome' OR LOWER(TRIM(browser)) LIKE 'chrome %' THEN 'Chrome'
        WHEN LOWER(TRIM(browser)) = 'edge' OR LOWER(TRIM(browser)) LIKE 'edge %' THEN 'Edge'
        WHEN LOWER(TRIM(browser)) = 'firefox' OR LOWER(TRIM(browser)) LIKE 'firefox %' THEN 'Firefox'
        WHEN LOWER(TRIM(browser)) = 'safari' OR LOWER(TRIM(browser)) LIKE 'safari %' THEN 'Safari'
        WHEN LOWER(TRIM(browser)) = 'opera' OR LOWER(TRIM(browser)) LIKE 'opera %' THEN 'Opera'
        WHEN LOWER(TRIM(browser)) = 'samsung browser' THEN 'Samsung Browser'
        WHEN LOWER(TRIM(browser)) = 'internet explorer' THEN 'Internet Explorer'
        ELSE TRIM(browser)
      END AS browser_name,
      COUNT(*)::INT AS session_count
    FROM public.visitor_sessions
    WHERE created_at >= st AND created_at <= nt
    GROUP BY 1
    ORDER BY session_count DESC, browser_name ASC
  ),
  ranked_browsers AS (
    SELECT 
      row_number() OVER (ORDER BY session_count DESC, browser_name ASC) AS rank_num,
      browser_name,
      session_count
    FROM grouped_browsers
  )
  SELECT 
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'name', browser_name,
          'count', session_count,
          'percentage', ROUND(((session_count::numeric / total_count::numeric) * 100)::numeric, 0)
        ) ORDER BY rank_num
      ) FILTER (WHERE rank_num <= 3),
      '[]'::jsonb
    ),
    COALESCE(SUM(session_count) FILTER (WHERE rank_num <= 3), 0)::INT
  INTO top_browsers, top_count_sum
  FROM ranked_browsers;

  others_count := total_count - top_count_sum;

  IF others_count > 0 THEN
    res := top_browsers || jsonb_build_array(jsonb_build_object(
      'name', 'Others',
      'count', others_count,
      'percentage', ROUND(((others_count::numeric / total_count::numeric) * 100)::numeric, 0)
    ));
  ELSE
    res := top_browsers;
  END IF;

  RETURN COALESCE(res, '[]'::jsonb);
END;
$$;


-- 3. get_analytics_operating_systems
CREATE OR REPLACE FUNCTION public.get_analytics_operating_systems(range_filter TEXT)
RETURNS JSONB
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  st TIMESTAMP WITH TIME ZONE;
  pst TIMESTAMP WITH TIME ZONE;
  nt TIMESTAMP WITH TIME ZONE;
  total_count INT := 0;
  top_count_sum INT := 0;
  others_count INT := 0;
  top_os JSONB;
  res JSONB;
BEGIN
  SELECT start_time, prev_start_time, now_time INTO st, pst, nt FROM public.get_timerange_bounds(range_filter);
  
  SELECT COUNT(*) INTO total_count FROM public.visitor_sessions WHERE created_at >= st AND created_at <= nt;
  
  IF total_count = 0 THEN
    RETURN '[]'::jsonb;
  END IF;

  WITH grouped_os AS (
    SELECT 
      CASE 
        WHEN COALESCE(TRIM(operating_system), '') = '' OR LOWER(TRIM(operating_system)) = 'other' THEN 'Other'
        WHEN LOWER(TRIM(operating_system)) = 'windows' OR LOWER(TRIM(operating_system)) LIKE 'windows %' THEN 'Windows'
        WHEN LOWER(TRIM(operating_system)) = 'macos' OR LOWER(TRIM(operating_system)) IN ('mac', 'macintosh', 'mac os x') THEN 'macOS'
        WHEN LOWER(TRIM(operating_system)) = 'android' THEN 'Android'
        WHEN LOWER(TRIM(operating_system)) IN ('ios', 'iphone', 'ipad') THEN 'iOS'
        WHEN LOWER(TRIM(operating_system)) = 'linux' THEN 'Linux'
        WHEN LOWER(TRIM(operating_system)) = 'chromeos' OR LOWER(TRIM(operating_system)) = 'chrome os' THEN 'ChromeOS'
        ELSE TRIM(operating_system)
      END AS os_name,
      COUNT(*)::INT AS session_count
    FROM public.visitor_sessions
    WHERE created_at >= st AND created_at <= nt
    GROUP BY 1
    ORDER BY session_count DESC, os_name ASC
  ),
  ranked_os AS (
    SELECT 
      row_number() OVER (ORDER BY session_count DESC, os_name ASC) AS rank_num,
      os_name,
      session_count
    FROM grouped_os
  )
  SELECT 
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'name', os_name,
          'count', session_count,
          'percentage', ROUND(((session_count::numeric / total_count::numeric) * 100)::numeric, 0)
        ) ORDER BY rank_num
      ) FILTER (WHERE rank_num <= 3),
      '[]'::jsonb
    ),
    COALESCE(SUM(session_count) FILTER (WHERE rank_num <= 3), 0)::INT
  INTO top_os, top_count_sum
  FROM ranked_os;

  others_count := total_count - top_count_sum;

  IF others_count > 0 THEN
    res := top_os || jsonb_build_array(jsonb_build_object(
      'name', 'Others',
      'count', others_count,
      'percentage', ROUND(((others_count::numeric / total_count::numeric) * 100)::numeric, 0)
    ));
  ELSE
    res := top_os;
  END IF;

  RETURN COALESCE(res, '[]'::jsonb);
END;
$$;
`;

async function test() {
  const client = new Client(prodConfig);
  await client.connect();

  try {
    console.log('Applying test migration on PROD...');
    await client.query(migrationSql);
    console.log('Applied successfully! Testing PROD across date ranges:');

    for (const r of ['today', '7days', '30days', '90days']) {
      console.log(`\n=== PROD Range [${r}] ===`);
      const devRes = await client.query('SELECT public.get_analytics_devices($1) as data;', [r]);
      const brRes = await client.query('SELECT public.get_analytics_browsers($1) as data;', [r]);
      const osRes = await client.query('SELECT public.get_analytics_operating_systems($1) as data;', [r]);

      console.log('Devices:', JSON.stringify(devRes.rows[0].data));
      console.log('Browsers (Top 3 + Others):', JSON.stringify(brRes.rows[0].data));
      console.log('Operating Systems (Top 3 + Others):', JSON.stringify(osRes.rows[0].data));
    }
  } finally {
    await client.end();
  }
}

test().catch(console.error);
