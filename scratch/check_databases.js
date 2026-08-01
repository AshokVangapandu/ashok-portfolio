const { createClient } = require('@supabase/supabase-js');

const db1 = {
  url: "https://xpuhbtsgwhgbcvmwzlyd.supabase.co",
  key: "sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z"
};

const db2 = {
  url: "https://txoszrnjkrlbjzpjisvp.supabase.co",
  key: "sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB"
};

async function checkDb(db, name) {
  try {
    const supabase = createClient(db.url, db.key);
    const { data, error } = await supabase
      .from('resume_settings')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();
    console.log(`[${name}] URL: ${db.url}`);
    if (error) {
      console.log(`  Error: ${error.message}`);
    } else {
      console.log(`  Active Resume:`, data);
    }
  } catch (err) {
    console.log(`  Exception in ${name}:`, err.message);
  }
}

async function run() {
  await checkDb(db1, "DB 1 (xpuhbtsgwhgbcvmwzlyd)");
  await checkDb(db2, "DB 2 (txoszrnjkrlbjzpjisvp)");
}

run();
