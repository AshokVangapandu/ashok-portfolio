const { createClient } = require('@supabase/supabase-js');

const devDb = {
  url: "https://xpuhbtsgwhgbcvmwzlyd.supabase.co",
  key: "sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z"
};

const prodDb = {
  url: "https://txoszrnjkrlbjzpjisvp.supabase.co",
  key: "sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB"
};

async function checkFunction(db, name) {
  const supabase = createClient(db.url, db.key);
  try {
    const { data, error } = await supabase.rpc('get_supabase_url');
    if (error) {
      console.log(`❌ [${name}] get_supabase_url failed: ${error.message} (code: ${error.code})`);
    } else {
      console.log(`✅ [${name}] get_supabase_url succeeded:`, data);
    }
  } catch (err) {
    console.log(`💥 [${name}] Exception:`, err.message);
  }
}

async function run() {
  await checkFunction(devDb, "DEV");
  await checkFunction(prodDb, "PROD");
}

run();
