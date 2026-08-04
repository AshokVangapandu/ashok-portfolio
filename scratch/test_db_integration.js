const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const resolverPath = path.resolve(__dirname, '../js/utilities/attribution.js');

const db = {
  url: 'https://xpuhbtsgwhgbcvmwzlyd.supabase.co',
  key: 'sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z'
};

const supabase = createClient(db.url, db.key);

async function runIntegrationTests() {
  console.log('--- STARTING TELEMETRY & DB INTEGRATION VERIFICATION ---');
  
  const { resolveTrafficSource } = await import(`file://${resolverPath}`);

  const scenarios = [
    {
      id: 'test-session-scen1-' + Date.now(),
      name: 'Scenario 1: UTM wins over Referrer',
      referrer: 'https://www.google.com/',
      search: '?utm_source=linkedin&utm_campaign=jobhunt',
      expected: {
        traffic_source: 'linkedin',
        traffic_source_display: 'LinkedIn',
        traffic_campaign: 'jobhunt',
        attribution_type: 'utm',
        referrer_url: 'https://www.google.com/'
      }
    },
    {
      id: 'test-session-scen2-' + Date.now(),
      name: 'Scenario 2: Referrer wins (no UTM)',
      referrer: 'https://github.com/',
      search: '',
      expected: {
        traffic_source: 'github',
        traffic_source_display: 'GitHub',
        traffic_campaign: null,
        attribution_type: 'referrer',
        referrer_url: 'https://github.com/'
      }
    },
    {
      id: 'test-session-scen3-' + Date.now(),
      name: 'Scenario 3: Typed URL (Direct)',
      referrer: '',
      search: '',
      expected: {
        traffic_source: 'direct',
        traffic_source_display: 'Direct',
        traffic_campaign: null,
        attribution_type: 'direct',
        referrer_url: ''
      }
    },
    {
      id: 'test-session-scen4-' + Date.now(),
      name: 'Scenario 4: Unknown Website',
      referrer: 'https://stackoverflow.com/questions/123',
      search: '',
      expected: {
        traffic_source: 'referral',
        traffic_source_display: 'Referral (stackoverflow.com)',
        traffic_campaign: null,
        attribution_type: 'referrer',
        referrer_url: 'https://stackoverflow.com/questions/123'
      }
    }
  ];

  let failed = false;

  for (const scen of scenarios) {
    console.log(`\nRunning ${scen.name}...`);
    
    // Resolve attribution
    const attribution = resolveTrafficSource(scen.referrer, scen.search);

    // Build insert payload
    const payload = {
      id: scen.id,
      visitor_id: 'test-visitor-' + Date.now(),
      ip_address: '127.0.0.1',
      country: 'TestLand',
      city: 'TestCity',
      user_agent: 'NodeIntegrationTest',
      browser: 'NodeJS',
      operating_system: 'Windows',
      device_type: 'Desktop',
      referrer: scen.referrer,
      traffic_source: attribution.source,
      traffic_source_display: attribution.sourceDisplay,
      traffic_medium: attribution.medium,
      traffic_campaign: attribution.campaign,
      traffic_content: attribution.content,
      traffic_term: attribution.term,
      referrer_url: attribution.referrer,
      attribution_type: attribution.attributionType
    };

    console.log('Sending payload to DB:', JSON.stringify(payload, null, 2));

    // Insert session into DB
    const { error: insertErr } = await supabase
      .from('visitor_sessions')
      .insert([payload]);

    if (insertErr) {
      console.error(`❌ DB Insert Failed for ${scen.name}:`, insertErr);
      failed = true;
      continue;
    }

    console.log('✅ Session record inserted.');

    // Fetch session back from DB using supabase CLI to bypass client RLS restrictions
    console.log('Retrieving record from database to verify persistence...');
    let data;
    try {
      const { execSync } = require('child_process');
      const sqlQuery = `SELECT traffic_source, traffic_medium, traffic_campaign, traffic_content, traffic_term, referrer_url, attribution_type, traffic_source_display FROM public.visitor_sessions WHERE id = '${scen.id}';`;
      const queryOutput = execSync(`npx supabase db query --linked --output-format json "${sqlQuery}"`, { encoding: 'utf-8' });
      // Clean queryOutput warning text or boundary lines if present
      // Extract the JSON block
      const startJson = queryOutput.indexOf('{');
      const endJson = queryOutput.lastIndexOf('}') + 1;
      const jsonContent = queryOutput.substring(startJson, endJson);
      const parsedResult = JSON.parse(jsonContent);
      data = parsedResult.rows[0];
      if (!data) {
        throw new Error('No rows returned from query');
      }
    } catch (selectErr) {
      console.error(`❌ DB Select Failed for ${scen.name}:`, selectErr.message || selectErr);
      failed = true;
      continue;
    }

    console.log('Fetched Record:', JSON.stringify(data, null, 2));

    // Validate fetched fields
    let match = true;
    for (const key of Object.keys(scen.expected)) {
      if (data[key] !== scen.expected[key]) {
        console.error(`❌ Field MISMATCH for [${key}]. Expected: "${scen.expected[key]}", Got: "${data[key]}"`);
        match = false;
      }
    }

    if (match) {
      console.log(`✅ SUCCESS: ${scen.name} verified successfully.`);
    } else {
      failed = true;
    }

    // Clean up record
    console.log('Cleaning up test record...');
    const { error: deleteErr } = await supabase
      .from('visitor_sessions')
      .delete()
      .eq('id', scen.id);
    if (deleteErr) {
      console.warn('⚠️ Cleanup failed to delete record:', scen.id, deleteErr);
    } else {
      console.log('✅ Cleanup successful.');
    }
  }

  if (!failed) {
    console.log('\n🎉 ALL INTEGRATION SCENARIOS VERIFIED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error('\n❌ INTEGRATION VERIFICATION FAILED.');
    process.exit(1);
  }
}

runIntegrationTests().catch(err => {
  console.error('Integration test failed with error:', err);
  process.exit(1);
});
