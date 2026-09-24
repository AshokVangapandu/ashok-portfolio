// scratch/deep_qa_analysis.js
const { Client } = require('pg');

const devConfig = {
  connectionString: 'postgresql://postgres.xpuhbtsgwhgbcvmwzlyd:Asher@4tyfive@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
};

const prodConfig = {
  connectionString: 'postgresql://postgres.txoszrnjkrlbjzpjisvp:Asher@4tyfive@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
};

async function deepAudit(config, name) {
  console.log(`\n======================================================================`);
  console.log(` DEEP AUDIT: ${name} DATABASE`);
  console.log(`======================================================================`);
  const client = new Client(config);
  await client.connect();

  try {
    // 1. Total counts
    const countRes = await client.query(`SELECT COUNT(*) FROM public.visitor_sessions;`);
    console.log(`Total visitor sessions in ${name}: ${countRes.rows[0].count}`);

    // 2. Deep dive into NodeJS sessions
    console.log(`\n--- NODEJS SESSIONS INVESTIGATION ---`);
    const nodeRes = await client.query(`
      SELECT 
        id, visitor_id, browser, operating_system, device_type, 
        user_agent, traffic_source, country, city, ip_address, 
        duration_seconds, created_at, updated_at
      FROM public.visitor_sessions
      WHERE browser ILIKE '%node%' OR user_agent ILIKE '%node%'
      ORDER BY created_at DESC
      LIMIT 15;
    `);
    console.log(`NodeJS sessions count: ${nodeRes.rows.length}`);
    if (nodeRes.rows.length > 0) {
      console.table(nodeRes.rows.map(r => ({
        created_at: r.created_at,
        browser: r.browser,
        os: r.operating_system,
        device: r.device_type,
        ua: (r.user_agent || '').substring(0, 45),
        source: r.traffic_source,
        ip: r.ip_address,
        country: r.country,
        dur: r.duration_seconds
      })));
    }

    // 3. Deep dive into OS categories: "Other" vs "Others"
    console.log(`\n--- OS CATEGORIES INVESTIGATION: 'Other' vs 'Others' ---`);
    const osRawRes = await client.query(`
      SELECT operating_system, COUNT(*) as session_count
      FROM public.visitor_sessions
      GROUP BY operating_system
      ORDER BY session_count DESC;
    `);
    console.log(`Raw Operating Systems in visitor_sessions table:`);
    console.table(osRawRes.rows);

    const otherOSRes = await client.query(`
      SELECT id, operating_system, browser, user_agent, created_at
      FROM public.visitor_sessions
      WHERE operating_system = 'Other' OR operating_system = 'Others' OR operating_system IS NULL
      LIMIT 10;
    `);
    console.log(`Sample records where operating_system in DB is 'Other' or NULL:`);
    console.table(otherOSRes.rows.map(r => ({
      id: r.id.substring(0, 8),
      os: r.operating_system,
      browser: r.browser,
      ua: (r.user_agent || '').substring(0, 50),
      created_at: r.created_at
    })));

    // 4. Test all ranges and check percentage sums
    console.log(`\n--- RANGE PERCENTAGES AND DISCREPANCIES ---`);
    const ranges = ['today', '7days', '30days', '90days'];
    for (const r of ranges) {
      const boundsRes = await client.query(`SELECT start_time, now_time FROM public.get_timerange_bounds($1);`, [r]);
      const { start_time, now_time } = boundsRes.rows[0];
      const countRangeRes = await client.query(`SELECT COUNT(*) as count FROM public.visitor_sessions WHERE created_at >= $1 AND created_at <= $2;`, [start_time, now_time]);
      const totalSessions = parseInt(countRangeRes.rows[0].count, 10);

      const devRpc = await client.query(`SELECT public.get_analytics_devices($1) as data;`, [r]);
      const brRpc = await client.query(`SELECT public.get_analytics_browsers($1) as data;`, [r]);
      const osRpc = await client.query(`SELECT public.get_analytics_operating_systems($1) as data;`, [r]);

      const devData = devRpc.rows[0].data || [];
      const brData = brRpc.rows[0].data || [];
      const osData = osRpc.rows[0].data || [];

      const devSum = devData.reduce((s, d) => s + d.count, 0);
      const devPctSum = devData.reduce((s, d) => s + d.percentage, 0);

      const brSum = brData.reduce((s, b) => s + b.count, 0);
      const brPctSum = brData.reduce((s, b) => s + b.percentage, 0);

      const osSum = osData.reduce((s, o) => s + o.count, 0);
      const osPctSum = osData.reduce((s, o) => s + o.percentage, 0);

      console.log(`\nRange [${r}] (Total DB sessions: ${totalSessions}):`);
      console.log(`  Devices: countSum=${devSum} (diff=${devSum - totalSessions}), pctSum=${devPctSum}%`);
      console.log(`    Data:`, JSON.stringify(devData));
      console.log(`  Browsers: countSum=${brSum} (diff=${brSum - totalSessions}), pctSum=${brPctSum}%`);
      console.log(`    Data:`, JSON.stringify(brData));
      console.log(`  OS: countSum=${osSum} (diff=${osSum - totalSessions}), pctSum=${osPctSum}%`);
      console.log(`    Data:`, JSON.stringify(osData));
    }

  } finally {
    await client.end();
  }
}

async function main() {
  await deepAudit(devConfig, 'DEV');
  await deepAudit(prodConfig, 'PROD');
}

main().catch(console.error);
