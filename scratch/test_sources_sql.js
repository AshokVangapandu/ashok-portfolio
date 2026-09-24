/* scratch/test_sources_sql.js */
const { Client } = require('pg');

const devConfig = {
  connectionString: 'postgresql://postgres.xpuhbtsgwhgbcvmwzlyd:Asher@4tyfive@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
};

const sqlMigration = `
CREATE OR REPLACE FUNCTION public.get_analytics_sources(range_filter TEXT)
RETURNS JSONB
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  st TIMESTAMP WITH TIME ZONE;
  pst TIMESTAMP WITH TIME ZONE;
  nt TIMESTAMP WITH TIME ZONE;
  total_count INT := 0;
  top_sources JSONB := '[]'::jsonb;
  others_sources JSONB := '[]'::jsonb;
  others_count INT := 0;
  others_pct NUMERIC := 0;
  top_count_sum INT := 0;
BEGIN
  -- 1. Get timerange bounds
  SELECT start_time, prev_start_time, now_time INTO st, pst, nt 
  FROM public.get_timerange_bounds(range_filter);

  -- 2. Count total sessions in range
  SELECT COUNT(*) INTO total_count
  FROM public.visitor_sessions
  WHERE created_at >= st AND created_at <= nt;

  IF total_count = 0 THEN
    RETURN jsonb_build_object(
      'totalCount', 0,
      'topSources', '[]'::jsonb,
      'others', jsonb_build_object(
        'count', 0,
        'percentage', 0,
        'sources', '[]'::jsonb
      )
    );
  END IF;

  -- 3. Aggregate all normalized traffic sources
  WITH normalized_sessions AS (
    SELECT
      CASE
        -- Internal / Self-referrals and local dev referrers -> Direct
        WHEN COALESCE(TRIM(traffic_source_display), '') = '' 
             OR LOWER(TRIM(traffic_source_display)) = 'direct' 
             OR LOWER(COALESCE(TRIM(traffic_source), '')) = 'direct'
             OR LOWER(TRIM(traffic_source_display)) ILIKE '%ashokvangapandu.com%'
             OR LOWER(TRIM(traffic_source_display)) ILIKE '%localhost%'
             OR LOWER(TRIM(traffic_source_display)) ILIKE '%127.0.0.1%'
             OR (traffic_source IS NULL AND referrer IS NULL)
        THEN 'Direct'

        -- Normalized canonical brand and UTM sources
        WHEN LOWER(TRIM(traffic_source)) = 'linkedin' OR LOWER(TRIM(traffic_source_display)) = 'linkedin' THEN 'LinkedIn'
        WHEN LOWER(TRIM(traffic_source)) = 'resume' OR LOWER(TRIM(traffic_source_display)) = 'resume' THEN 'Resume'
        WHEN LOWER(TRIM(traffic_source)) = 'email' OR LOWER(TRIM(traffic_source_display)) = 'email' THEN 'Email'
        WHEN LOWER(TRIM(traffic_source)) = 'github' OR LOWER(TRIM(traffic_source_display)) = 'github' THEN 'GitHub'
        WHEN LOWER(TRIM(traffic_source)) = 'qr' OR LOWER(TRIM(traffic_source_display)) IN ('qr', 'qr code') THEN 'QR Code'
        WHEN LOWER(TRIM(traffic_source)) = 'google' OR LOWER(TRIM(traffic_source_display)) IN ('google', 'google search') THEN 'Google Search'
        WHEN LOWER(TRIM(traffic_source)) = 'bing' OR LOWER(TRIM(traffic_source_display)) = 'bing' THEN 'Bing'
        WHEN LOWER(TRIM(traffic_source)) = 'duckduckgo' OR LOWER(TRIM(traffic_source_display)) = 'duckduckgo' THEN 'DuckDuckGo'
        WHEN LOWER(TRIM(traffic_source)) = 'twitter' OR LOWER(TRIM(traffic_source_display)) IN ('twitter', 'x (twitter)', 'x') THEN 'X (Twitter)'
        WHEN LOWER(TRIM(traffic_source)) = 'reddit' OR LOWER(TRIM(traffic_source_display)) = 'reddit' THEN 'Reddit'
        WHEN LOWER(TRIM(traffic_source)) = 'youtube' OR LOWER(TRIM(traffic_source_display)) = 'youtube' THEN 'YouTube'
        WHEN LOWER(TRIM(traffic_source)) = 'facebook' OR LOWER(TRIM(traffic_source_display)) = 'facebook' THEN 'Facebook'
        WHEN LOWER(TRIM(traffic_source)) = 'instagram' OR LOWER(TRIM(traffic_source_display)) = 'instagram' THEN 'Instagram'

        ELSE TRIM(traffic_source_display)
      END AS display_name
    FROM public.visitor_sessions
    WHERE created_at >= st AND created_at <= nt
  ),
  aggregated_sources AS (
    SELECT
      display_name,
      CASE
        WHEN LOWER(display_name) = 'direct' THEN 'direct'
        WHEN LOWER(display_name) = 'linkedin' THEN 'linkedin'
        WHEN LOWER(display_name) = 'resume' THEN 'resume'
        WHEN LOWER(display_name) = 'email' THEN 'email'
        WHEN LOWER(display_name) = 'github' THEN 'github'
        WHEN LOWER(display_name) = 'qr code' THEN 'qr'
        WHEN LOWER(display_name) = 'google search' THEN 'google'
        WHEN LOWER(display_name) IN ('bing', 'duckduckgo') THEN 'search'
        WHEN LOWER(display_name) IN ('x (twitter)', 'twitter', 'reddit', 'youtube', 'facebook', 'instagram') THEN 'social'
        WHEN LOWER(display_name) ILIKE 'referral%' THEN 'referral'
        ELSE 'other'
      END AS source_type,
      COUNT(*)::INT AS session_count,
      ROUND(((COUNT(*)::NUMERIC / total_count::NUMERIC) * 100)::NUMERIC, 2) AS percentage
    FROM normalized_sessions
    GROUP BY display_name
    ORDER BY session_count DESC, display_name ASC
  ),
  ranked_sources AS (
    SELECT
      row_number() OVER (ORDER BY session_count DESC, display_name ASC) AS rank_num,
      display_name,
      source_type,
      session_count,
      percentage
    FROM aggregated_sources
  )
  -- Top 3 sources
  SELECT 
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'rank', rank_num,
          'source', display_name,
          'display', display_name,
          'count', session_count,
          'percentage', percentage,
          'type', source_type
        ) ORDER BY rank_num
      ) FILTER (WHERE rank_num <= 3),
      '[]'::jsonb
    ),
    -- Remaining sources for Others popup
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'rank', rank_num,
          'source', display_name,
          'display', display_name,
          'count', session_count,
          'percentage', percentage,
          'type', source_type
        ) ORDER BY rank_num
      ) FILTER (WHERE rank_num > 3),
      '[]'::jsonb
    ),
    COALESCE(SUM(session_count) FILTER (WHERE rank_num <= 3), 0)::INT
  INTO top_sources, others_sources, top_count_sum
  FROM ranked_sources;

  -- 4. Calculate Others totals
  others_count := total_count - top_count_sum;
  IF total_count > 0 THEN
    others_pct := ROUND(((others_count::NUMERIC / total_count::NUMERIC) * 100)::NUMERIC, 2);
  ELSE
    others_pct := 0;
  END IF;

  RETURN jsonb_build_object(
    'totalCount', total_count,
    'topSources', top_sources,
    'others', jsonb_build_object(
      'count', others_count,
      'percentage', others_pct,
      'sources', others_sources
    )
  );
END;
$$;
`;

async function test() {
  const client = new Client(devConfig);
  await client.connect();

  try {
    console.log('Applying test migration on DEV...');
    await client.query(sqlMigration);
    console.log('Applied successfully! Testing RPC across ranges:');

    for (const r of ['today', '7days', '30days', '90days']) {
      const res = await client.query(`SELECT public.get_analytics_sources($1) as res;`, [r]);
      console.log(`\nRange [${r}]:`, JSON.stringify(res.rows[0].res, null, 2));
    }
  } finally {
    await client.end();
  }
}

test().catch(console.error);
