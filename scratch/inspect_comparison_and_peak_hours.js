// scratch/inspect_comparison_and_peak_hours.js
const { Client } = require('pg');

const devConfig = {
  connectionString: 'postgresql://postgres.xpuhbtsgwhgbcvmwzlyd:Asher@4tyfive@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
};

const prodConfig = {
  connectionString: 'postgresql://postgres.txoszrnjkrlbjzpjisvp:Asher@4tyfive@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
};

async function audit(config, name) {
  console.log(`\n======================================================================`);
  console.log(` AUDITING ${name} DATABASE: Visitor Comparison & Peak Hours`);
  console.log(`======================================================================`);
  const client = new Client(config);
  await client.connect();

  try {
    for (const range of ['today', '7days', '30days', '90days']) {
      console.log(`\n--------------------------------------------------`);
      console.log(` RANGE: ${range}`);
      console.log(`--------------------------------------------------`);

      // 1. Call RPCs
      const compRes = await client.query(`SELECT public.get_analytics_visitor_comparison($1) as data;`, [range]);
      const peakRes = await client.query(`SELECT public.get_analytics_peak_hours($1) as data;`, [range]);

      const comp = compRes.rows[0].data;
      const peak = peakRes.rows[0].data;

      console.log(`1. Visitor Comparison RPC Output:`);
      console.log(JSON.stringify(comp, null, 2));

      // Check sum of new + returning unique visitors
      if (comp) {
        const totalU = comp.totalUniqueVisitors;
        const newV = comp.newVisitors;
        const retV = comp.returningVisitors;
        const newP = comp.newPercentage;
        const retP = comp.returningPercentage;

        console.log(`   Verification: new (${newV}) + returning (${retV}) = ${newV + retV} vs totalUnique (${totalU})`);
        console.log(`   Verification: newPct (${newP}%) + retPct (${retP}%) = ${newP + retP}%`);
      }

      console.log(`\n2. Peak Hours RPC Output:`);
      const nonZeroHours = (peak || []).filter(p => p.count > 0 || p.value > 0);
      console.log(`   Total 24 hours returned: ${(peak || []).length}`);
      console.log(`   Non-zero hours count: ${nonZeroHours.length}`);
      console.table(nonZeroHours.map(p => ({
        hour: p.hour,
        label: p.label,
        count: p.count,
        intensity: p.value,
        tz: p.timezone
      })));

      const peakHour = (peak || []).reduce((max, curr) => (curr.count > (max?.count || 0) ? curr : max), null);
      if (peakHour && peakHour.count > 0) {
        console.log(`   -> Peak Hour is: ${peakHour.hour.toUpperCase()} (${peakHour.label}) with ${peakHour.count} visits (intensity ${peakHour.value}/10)`);
      } else {
        console.log(`   -> No visits in this range.`);
      }
    }
  } finally {
    await client.end();
  }
}

async function main() {
  await audit(devConfig, 'DEV');
  await audit(prodConfig, 'PROD');
}

main().catch(console.error);
