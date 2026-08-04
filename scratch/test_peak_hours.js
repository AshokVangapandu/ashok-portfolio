const { createClient } = require('@supabase/supabase-js');

// Database configuration matching current site credentials
const db = {
  url: "https://xpuhbtsgwhgbcvmwzlyd.supabase.co",
  key: "sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z"
};

const supabase = createClient(db.url, db.key);

async function runTest() {
  console.log('--- TESTING get_analytics_peak_hours RPC ---');
  try {
    const { data, error } = await supabase.rpc('get_analytics_peak_hours', { range_filter: '7days' });
    if (error) {
      console.error('❌ RPC Call Failed with Error:', error);
      process.exit(1);
    }
    console.log('✅ RPC Call Succeeded!');
    console.log('Sample data items:');
    console.log(JSON.stringify(data.slice(15, 20), null, 2));
    
    // Verify that all 24 elements are present
    if (data && data.length === 24) {
      console.log('✅ Correct count: 24 hours returned successfully.');
    } else {
      console.error('❌ Incorrect count: expected 24 hours, got:', data ? data.length : 0);
    }
  } catch (err) {
    console.error('❌ Unexpected Error:', err);
    process.exit(1);
  }
}

runTest();
