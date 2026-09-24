// scratch/check_30days.js
const { Client } = require('pg');

const prodConfig = {
  connectionString: 'postgresql://postgres.txoszrnjkrlbjzpjisvp:Asher@4tyfive@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
};

async function check() {
  const client = new Client(prodConfig);
  await client.connect();

  try {
    const boundsRes = await client.query(`SELECT start_time, now_time FROM public.get_timerange_bounds('30days');`);
    const { start_time, now_time } = boundsRes.rows[0];
    console.log(`30days bounds: ${start_time} to ${now_time}`);

    const res = await client.query(`
      SELECT operating_system, COUNT(*) as c
      FROM public.visitor_sessions
      WHERE created_at >= $1 AND created_at <= $2
      GROUP BY operating_system
      ORDER BY c DESC;
    `, [start_time, now_time]);

    console.log('30days PROD raw breakdown:');
    console.table(res.rows);

    const rpcRes = await client.query(`SELECT public.get_analytics_operating_systems('30days') as data;`);
    console.log('30days PROD RPC result:', rpcRes.rows[0].data);
  } finally {
    await client.end();
  }
}

check().catch(console.error);
