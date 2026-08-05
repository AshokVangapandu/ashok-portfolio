const { createClient } = require('@supabase/supabase-js');

const devDb = {
  url: "https://xpuhbtsgwhgbcvmwzlyd.supabase.co",
  key: "sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z"
};

const prodDb = {
  url: "https://txoszrnjkrlbjzpjisvp.supabase.co",
  key: "sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB"
};

const tables = ['visitor_sessions', 'page_views', 'analytics_events', 'visitor_profiles'];

async function testTables(db, name) {
  console.log(`\nChecking tables on ${name} (${db.url}):`);
  const supabase = createClient(db.url, db.key);
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`❌ Table ${table}: FAILED. Message: ${error.message} (code: ${error.code})`);
    } else {
      console.log(`✅ Table ${table}: EXISTS`);
    }
  }
}

async function run() {
  await testTables(devDb, "DEV");
  await testTables(prodDb, "PROD");
}

run();
