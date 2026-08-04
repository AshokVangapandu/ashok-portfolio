/* scratch/test_locations_integration.js */
const { createClient } = require('@supabase/supabase-js');
const db = {
  url: 'https://xpuhbtsgwhgbcvmwzlyd.supabase.co',
  key: 'sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z'
};

const supabase = createClient(db.url, db.key);

async function run() {
  console.log('--- STARTING VISITOR LOCATIONS INTEGRATION VERIFICATION ---');
  
  const testId = 'test-loc-session-' + Date.now();
  const testVisitorId = 'test-visitor-' + Date.now();

  const payload = {
    id: testId,
    visitor_id: testVisitorId,
    ip_address: '127.0.0.1',
    country: 'Atlantis',
    country_code: 'AT',
    city: 'Poseidon City',
    user_agent: 'NodeIntegrationTest',
    browser: 'NodeJS',
    operating_system: 'Windows',
    device_type: 'Desktop',
    referrer: '',
    traffic_source: 'direct',
    attribution_type: 'direct'
  };

  try {
    console.log(`Inserting test session with country: ${payload.country}, country_code: ${payload.country_code}, city: ${payload.city}`);
    const { error: insertErr } = await supabase
      .from('visitor_sessions')
      .insert([payload]);

    if (insertErr) {
      throw new Error(`DB Insert Failed: ${JSON.stringify(insertErr)}`);
    }
    console.log('✅ Session record inserted.');

    // Retrieve via CLI to bypass client RLS and verify db persistence
    console.log('Verifying record via CLI query...');
    const { execSync } = require('child_process');
    const sqlQuery = `SELECT country, country_code, city FROM public.visitor_sessions WHERE id = '${testId}';`;
    const queryOutput = execSync(`npx supabase db query --linked --output-format json "${sqlQuery}"`, { encoding: 'utf-8' });
    
    const startJson = queryOutput.indexOf('{');
    const endJson = queryOutput.lastIndexOf('}') + 1;
    const parsedResult = JSON.parse(queryOutput.substring(startJson, endJson));
    const savedRecord = parsedResult.rows[0];

    if (!savedRecord) {
      throw new Error('Record could not be retrieved from database.');
    }
    console.log('Saved Record:', JSON.stringify(savedRecord, null, 2));

    if (savedRecord.country_code !== 'AT') {
      throw new Error(`Country code mismatch. Expected 'AT', Got '${savedRecord.country_code}'`);
    }
    console.log('✅ Verification of country_code column storage succeeded.');

    // Verify RPC response format
    console.log('Calling get_analytics_locations RPC...');
    const rpcQuery = `SELECT public.get_analytics_locations('today');`;
    const rpcOutput = execSync(`npx supabase db query --linked --output-format json "${rpcQuery}"`, { encoding: 'utf-8' });
    
    const startRpc = rpcOutput.indexOf('{');
    const endRpc = rpcOutput.lastIndexOf('}') + 1;
    const parsedRpc = JSON.parse(rpcOutput.substring(startRpc, endRpc));
    const locationsList = parsedRpc.rows[0].get_analytics_locations;

    console.log('RPC Response (get_analytics_locations):', JSON.stringify(locationsList, null, 2));

    const testCountry = locationsList.find(loc => loc.country === 'Atlantis');
    if (!testCountry) {
      throw new Error("Could not find inserted test country 'Atlantis' in RPC output.");
    }

    console.log('Found Test Country in RPC output:', JSON.stringify(testCountry, null, 2));
    
    if (testCountry.countryCode !== 'AT') {
      throw new Error(`RPC countryCode mapping failed. Expected 'AT', Got '${testCountry.countryCode}'`);
    }
    if (!testCountry.cities.includes('Poseidon City')) {
      throw new Error(`RPC cities array missing expected city. Got: ${JSON.stringify(testCountry.cities)}`);
    }

    console.log('✅ get_analytics_locations RPC format verification succeeded.');

  } catch (err) {
    console.error('❌ Verification failed:', err.message || err);
    process.exitCode = 1;
  } finally {
    console.log('Cleaning up test record...');
    const { error: deleteErr } = await supabase
      .from('visitor_sessions')
      .delete()
      .eq('id', testId);
    if (deleteErr) {
      console.error('❌ Cleanup failed:', deleteErr);
    } else {
      console.log('✅ Cleanup completed.');
    }
    console.log('--- VERIFICATION FINISHED ---');
  }
}

run();
