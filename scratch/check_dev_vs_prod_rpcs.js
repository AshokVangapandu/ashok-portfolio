// scratch/check_dev_vs_prod_rpcs.js
const { Client } = require('pg');

const devConfig = {
  connectionString: 'postgresql://postgres.xpuhbtsgwhgbcvmwzlyd:Asher@4tyfive@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
};

const prodConfig = {
  connectionString: 'postgresql://postgres.txoszrnjkrlbjzpjisvp:Asher@4tyfive@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
};

async function check(config, name) {
  const client = new Client(config);
  await client.connect();

  try {
    const r1 = await client.query(`SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'get_analytics_visitor_comparison';`);
    const r2 = await client.query(`SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'get_analytics_peak_hours';`);

    console.log(`\n=================== ${name} ===================`);
    console.log(`get_analytics_visitor_comparison:\n`, r1.rows[0]?.pg_get_functiondef?.substring(0, 300));
    console.log(`\nget_analytics_peak_hours:\n`, r2.rows[0]?.pg_get_functiondef?.substring(0, 300));
  } finally {
    await client.end();
  }
}

async function main() {
  await check(devConfig, 'DEV');
  await check(prodConfig, 'PROD');
}

main().catch(console.error);
