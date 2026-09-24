/* scratch/audit_devices_browsers_os.js */
const { Client } = require('pg');

const devConfig = {
  connectionString: 'postgresql://postgres.xpuhbtsgwhgbcvmwzlyd:Asher@4tyfive@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
};

const prodConfig = {
  connectionString: 'postgresql://postgres.txoszrnjkrlbjzpjisvp:Asher@4tyfive@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
};

async function auditDatabase(config, name) {
  console.log(`\n======================================================`);
  console.log(` AUDITING DATABASE: ${name}`);
  console.log(`======================================================`);
  const client = new Client(config);
  await client.connect();

  try {
    // 1. Overall counts in visitor_sessions
    const totalRes = await client.query(`SELECT COUNT(*) as total_sessions FROM public.visitor_sessions;`);
    console.log(`Total visitor_sessions count: ${totalRes.rows[0].total_sessions}`);

    // 2. Distinct device_type, browser, operating_system values in DB
    const devDistRes = await client.query(`
      SELECT device_type, COUNT(*) as count 
      FROM public.visitor_sessions 
      GROUP BY device_type 
      ORDER BY count DESC;
    `);
    console.log(`\nDistinct Device Types:`);
    console.table(devDistRes.rows);

    const brDistRes = await client.query(`
      SELECT browser, COUNT(*) as count 
      FROM public.visitor_sessions 
      GROUP BY browser 
      ORDER BY count DESC;
    `);
    console.log(`\nDistinct Browsers:`);
    console.table(brDistRes.rows);

    const osDistRes = await client.query(`
      SELECT operating_system, COUNT(*) as count 
      FROM public.visitor_sessions 
      GROUP BY operating_system 
      ORDER BY count DESC;
    `);
    console.log(`\nDistinct Operating Systems:`);
    console.table(osDistRes.rows);

    // 3. User agent samples and their parsed browser/OS/device
    const sampleRes = await client.query(`
      SELECT browser, operating_system, device_type, user_agent
      FROM public.visitor_sessions
      WHERE user_agent IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 15;
    `);
    console.log(`\nUser-Agent Samples vs Parsed Columns:`);
    console.table(sampleRes.rows);

    // 4. Test RPCs across ranges
    const ranges = ['today', '7days', '30days', '90days'];
    for (const r of ranges) {
      console.log(`\n--- Range Filter: ${r} ---`);

      // Time range bounds
      const boundsRes = await client.query(`SELECT start_time, prev_start_time, now_time FROM public.get_timerange_bounds($1);`, [r]);
      const { start_time, now_time } = boundsRes.rows[0];

      // Raw session count in range
      const rangeCountRes = await client.query(`
        SELECT COUNT(*) as total FROM public.visitor_sessions 
        WHERE created_at >= $1 AND created_at <= $2;
      `, [start_time, now_time]);
      const sessionCount = parseInt(rangeCountRes.rows[0].total, 10);
      console.log(`Total sessions in range [${r}]: ${sessionCount}`);

      // Call RPCs
      const devRpc = await client.query(`SELECT public.get_analytics_devices($1) as data;`, [r]);
      const brRpc = await client.query(`SELECT public.get_analytics_browsers($1) as data;`, [r]);
      const osRpc = await client.query(`SELECT public.get_analytics_operating_systems($1) as data;`, [r]);

      console.log(`get_analytics_devices:`, JSON.stringify(devRpc.rows[0].data));
      console.log(`get_analytics_browsers:`, JSON.stringify(brRpc.rows[0].data));
      console.log(`get_analytics_operating_systems:`, JSON.stringify(osRpc.rows[0].data));
    }

  } finally {
    await client.end();
  }
}

async function run() {
  await auditDatabase(devConfig, 'DEV');
  await auditDatabase(prodConfig, 'PROD');
}

run().catch(console.error);
