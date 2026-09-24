/* scratch/test_sources_inspection.js */
const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const devConfig = {
  connectionString: 'postgresql://postgres.xpuhbtsgwhgbcvmwzlyd:Asher@4tyfive@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
};

const prodConfig = {
  connectionString: 'postgresql://postgres.txoszrnjkrlbjzpjisvp:Asher@4tyfive@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
};

async function inspect(config, name) {
  console.log(`\n=== INSPECTING ${name} ===`);
  const client = new Client(config);
  await client.connect();

  try {
    // 1. Columns in visitor_sessions
    const colsRes = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'visitor_sessions' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    console.log(`\nColumns in visitor_sessions:`);
    console.table(colsRes.rows.map(r => ({ column: r.column_name, type: r.data_type, nullable: r.is_nullable })));

    // 2. Sample records in visitor_sessions with attribution fields
    const sampleRes = await client.query(`
      SELECT id, created_at, referrer, traffic_source, traffic_source_display, traffic_medium, traffic_campaign, attribution_type, referrer_url
      FROM public.visitor_sessions
      ORDER BY created_at DESC
      LIMIT 15;
    `);
    console.log(`\nSample records:`);
    console.table(sampleRes.rows);

    // 3. Distinct traffic_source values and counts
    const distinctRes = await client.query(`
      SELECT traffic_source, traffic_source_display, traffic_medium, attribution_type, COUNT(*) as session_count
      FROM public.visitor_sessions
      GROUP BY traffic_source, traffic_source_display, traffic_medium, attribution_type
      ORDER BY session_count DESC;
    `);
    console.log(`\nDistinct traffic sources in DB:`);
    console.table(distinctRes.rows);

    // 4. Test RPC get_analytics_sources for each range
    for (const range of ['today', '7days', '30days', '90days']) {
      const rpcRes = await client.query(`SELECT public.get_analytics_sources($1) as sources;`, [range]);
      console.log(`\nget_analytics_sources('${range}'):`, JSON.stringify(rpcRes.rows[0].sources, null, 2));
    }

  } finally {
    await client.end();
  }
}

async function run() {
  await inspect(devConfig, 'DEV');
  await inspect(prodConfig, 'PROD');
}

run().catch(console.error);
