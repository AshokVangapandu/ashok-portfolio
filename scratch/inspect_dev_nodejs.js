// scratch/inspect_dev_nodejs.js
const { Client } = require('pg');

const devConfig = {
  connectionString: 'postgresql://postgres.xpuhbtsgwhgbcvmwzlyd:Asher@4tyfive@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
};

async function inspectDev() {
  const client = new Client(devConfig);
  await client.connect();

  try {
    const res = await client.query(`
      SELECT 
        id, visitor_id, browser, operating_system, device_type, 
        user_agent, traffic_source, country, city, ip_address, 
        duration_seconds, created_at
      FROM public.visitor_sessions
      WHERE browser = 'NodeJS'
      ORDER BY created_at DESC;
    `);

    console.log(`Found ${res.rows.length} NodeJS records in DEV:`);
    console.table(res.rows.map(r => ({
      created_at: r.created_at,
      browser: r.browser,
      os: r.operating_system,
      device: r.device_type,
      user_agent: r.user_agent,
      source: r.traffic_source,
      ip: r.ip_address,
      country: r.country
    })));
  } finally {
    await client.end();
  }
}

inspectDev().catch(console.error);
