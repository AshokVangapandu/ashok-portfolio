// scratch/test_dev_widgets_detailed.js
const { Client } = require('pg');

const devConfig = {
  connectionString: 'postgresql://postgres.xpuhbtsgwhgbcvmwzlyd:Asher@4tyfive@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
};

async function testDEV() {
  const client = new Client(devConfig);
  await client.connect();

  try {
    for (const r of ['today', '7days', '30days', '90days']) {
      console.log(`\n========================================================`);
      console.log(` RANGE: ${r}`);
      console.log(`========================================================`);

      const compRes = await client.query(`SELECT public.get_analytics_visitor_comparison($1) as data;`, [r]);
      const peakRes = await client.query(`SELECT public.get_analytics_peak_hours($1) as data;`, [r]);

      console.log('Visitor Comparison:', compRes.rows[0].data);

      const activePeak = (peakRes.rows[0].data || []).filter(p => p.count > 0);
      console.log(`Peak Hours (${activePeak.length} active hours):`);
      console.table(activePeak);
    }
  } finally {
    await client.end();
  }
}

testDEV().catch(console.error);
