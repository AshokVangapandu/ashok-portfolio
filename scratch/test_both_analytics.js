const { createClient } = require('@supabase/supabase-js');

const devDb = {
  url: "https://xpuhbtsgwhgbcvmwzlyd.supabase.co",
  key: "sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z"
};

const prodDb = {
  url: "https://txoszrnjkrlbjzpjisvp.supabase.co",
  key: "sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB"
};

const rpcList = [
  'get_analytics_summary',
  'get_analytics_trends',
  'get_analytics_activities',
  'get_analytics_locations',
  'get_analytics_sources',
  'get_analytics_devices',
  'get_analytics_browsers',
  'get_analytics_operating_systems',
  'get_analytics_visitor_comparison',
  'get_analytics_peak_hours'
];

async function testDatabase(db, name) {
  console.log(`\n====================================================`);
  console.log(`Testing Database: ${name} (${db.url})`);
  console.log(`====================================================`);
  
  const supabase = createClient(db.url, db.key);
  
  for (const rpc of rpcList) {
    try {
      let args = { range_filter: '30days' };
      if (rpc === 'get_analytics_trends') {
        args = { range_filter: '30days', trend_mode: 'daily' };
      }
      
      const { data, error } = await supabase.rpc(rpc, args);
      if (error) {
        console.error(`❌ ${rpc}: FAILED`);
        console.error(`   Message: ${error.message}`);
        console.error(`   Code: ${error.code}`);
        console.error(`   Details: ${error.details}`);
        console.error(`   Hint: ${error.hint}`);
      } else {
        console.log(`✅ ${rpc}: SUCCESS (rows: ${Array.isArray(data) ? data.length : '1/object'})`);
      }
    } catch (err) {
      console.error(`💥 ${rpc}: EXCEPTION:`, err.message);
    }
  }
}

async function run() {
  await testDatabase(devDb, "DEV");
  await testDatabase(prodDb, "PROD");
}

run();
