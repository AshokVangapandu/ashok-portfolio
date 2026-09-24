/* scratch/test_sources_end_to_end.js */
const { resolveTrafficSource } = require('../js/utilities/attribution.js');
const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');

const devDb = {
  url: 'https://xpuhbtsgwhgbcvmwzlyd.supabase.co',
  key: 'sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z',
  connectionString: 'postgresql://postgres.xpuhbtsgwhgbcvmwzlyd:Asher@4tyfive@aws-1-ap-south-1.pooler.supabase.com:5432/postgres'
};

async function testAttributionResolution() {
  console.log('=== TEST 1: ATTRIBUTION RESOLUTION LOGIC ===');

  const testCases = [
    {
      name: 'Resume UTM',
      search: '?utm_source=resume&utm_medium=pdf',
      ref: '',
      expectedSource: 'resume',
      expectedDisplay: 'Resume',
      expectedType: 'utm'
    },
    {
      name: 'Email UTM',
      search: '?utm_source=email&utm_medium=recruiter',
      ref: '',
      expectedSource: 'email',
      expectedDisplay: 'Email',
      expectedType: 'utm'
    },
    {
      name: 'LinkedIn UTM',
      search: '?utm_source=linkedin&utm_medium=social',
      ref: '',
      expectedSource: 'linkedin',
      expectedDisplay: 'LinkedIn',
      expectedType: 'utm'
    },
    {
      name: 'GitHub UTM',
      search: '?utm_source=github&utm_medium=profile',
      ref: '',
      expectedSource: 'github',
      expectedDisplay: 'GitHub',
      expectedType: 'utm'
    },
    {
      name: 'QR Code UTM',
      search: '?utm_source=qr&utm_medium=cv',
      ref: '',
      expectedSource: 'qr',
      expectedDisplay: 'QR Code',
      expectedType: 'utm'
    },
    {
      name: 'UTM Priority over Referrer',
      search: '?utm_source=linkedin&utm_medium=social',
      ref: 'https://www.google.com/',
      expectedSource: 'linkedin',
      expectedDisplay: 'LinkedIn',
      expectedType: 'utm'
    },
    {
      name: 'Self-Referral (Portfolio domain)',
      search: '',
      ref: 'https://ashokvangapandu.com/projects',
      expectedSource: 'direct',
      expectedDisplay: 'Direct',
      expectedType: 'direct'
    },
    {
      name: 'Gmail Android App',
      search: '',
      ref: 'android-app://com.google.android.gm/',
      expectedSource: 'email',
      expectedDisplay: 'Email',
      expectedType: 'referrer'
    },
    {
      name: 'Google Organic Search',
      search: '',
      ref: 'https://www.google.co.in/url?sa=t',
      expectedSource: 'google',
      expectedDisplay: 'Google Search',
      expectedType: 'referrer'
    },
    {
      name: 'Stack Overflow Referral',
      search: '',
      ref: 'https://stackoverflow.com/questions/xyz',
      expectedSource: 'referral',
      expectedDisplay: 'Referral (stackoverflow.com)',
      expectedType: 'referrer'
    },
    {
      name: 'Direct Access',
      search: '',
      ref: '',
      expectedSource: 'direct',
      expectedDisplay: 'Direct',
      expectedType: 'direct'
    }
  ];

  let allPassed = true;
  for (const tc of testCases) {
    const res = resolveTrafficSource(tc.ref, tc.search);
    const pass = res.source === tc.expectedSource &&
                 res.sourceDisplay === tc.expectedDisplay &&
                 res.attributionType === tc.expectedType;

    console.log(`${pass ? '✅' : '❌'} ${tc.name}:`);
    console.log(`   Source: ${res.source} (expected: ${tc.expectedSource})`);
    console.log(`   Display: ${res.sourceDisplay} (expected: ${tc.expectedDisplay})`);
    console.log(`   Type: ${res.attributionType} (expected: ${tc.expectedType})`);
    if (!pass) allPassed = false;
  }

  if (!allPassed) throw new Error('Attribution resolution tests failed!');
  console.log('✅ ALL ATTRIBUTION RESOLUTION TESTS PASSED!\n');
}

async function testDatabaseEndToEnd() {
  console.log('=== TEST 2: DATABASE INSERTION & RPC AGGREGATION ===');
  const supabase = createClient(devDb.url, devDb.key);

  const testVisitorId = `test-profile-${Date.now()}`;
  const testBatch = [
    { source: 'linkedin', display: 'LinkedIn', medium: 'social', type: 'utm', count: 4 },
    { source: 'resume', display: 'Resume', medium: 'pdf', type: 'utm', count: 3 },
    { source: 'github', display: 'GitHub', medium: 'profile', type: 'utm', count: 2 },
    { source: 'email', display: 'Email', medium: 'recruiter', type: 'utm', count: 1 },
    { source: 'qr', display: 'QR Code', medium: 'cv', type: 'utm', count: 1 }
  ];

  const insertedSessionIds = [];
  try {
    // 1. Create test profile
    const { error: profErr } = await supabase.from('visitor_profiles').insert([{
      visitor_id: testVisitorId
    }]);
    if (profErr) throw profErr;

    // 2. Insert sessions
    for (const item of testBatch) {
      for (let i = 0; i < item.count; i++) {
        const id = `test-ts-session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        insertedSessionIds.push(id);

        const { error } = await supabase.from('visitor_sessions').insert([{
          id,
          visitor_id: testVisitorId,
          ip_address: '127.0.0.1',
          country: 'India',
          country_code: 'IN',
          city: 'Hyderabad',
          user_agent: 'TrafficTestRunner',
          browser: 'Chrome',
          operating_system: 'Windows',
          device_type: 'Desktop',
          referrer: '',
          traffic_source: item.source,
          traffic_source_display: item.display,
          traffic_medium: item.medium,
          attribution_type: item.type
        }]);

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
      }
    }

    console.log(`Inserted ${insertedSessionIds.length} synthetic sessions. Querying get_analytics_sources('today')...`);
    const { data: rpcData, error: rpcErr } = await supabase.rpc('get_analytics_sources', { range_filter: 'today' });
    if (rpcErr) throw rpcErr;

    console.log('RPC Result:', JSON.stringify(rpcData, null, 2));

    // Verify:
    // Top 3 should exist, Others should exist with remaining sources
    if (!rpcData.topSources || rpcData.topSources.length > 3) {
      throw new Error(`Expected topSources <= 3, got ${rpcData.topSources.length}`);
    }

    const topPctSum = rpcData.topSources.reduce((s, x) => s + Number(x.percentage), 0);
    const totalPct = topPctSum + Number(rpcData.others.percentage);
    console.log(`Total Percentage Sum: ${totalPct.toFixed(2)}% (Top: ${topPctSum.toFixed(2)}%, Others: ${rpcData.others.percentage}%)`);

    if (Math.abs(totalPct - 100) > 1.0) {
      throw new Error(`Total percentage does not sum to ~100%: ${totalPct}`);
    }

    console.log('✅ DATABASE END-TO-END VERIFICATION PASSED!\n');
  } finally {
    // Clean up test records
    const pgClient = new Client({ connectionString: devDb.connectionString, ssl: { rejectUnauthorized: false } });
    await pgClient.connect();
    if (insertedSessionIds.length > 0) {
      await pgClient.query('DELETE FROM public.visitor_sessions WHERE id = ANY($1)', [insertedSessionIds]);
    }
    await pgClient.query('DELETE FROM public.visitor_profiles WHERE visitor_id = $1', [testVisitorId]);
    await pgClient.end();
    console.log('Cleaned up synthetic test records.');
  }
}

async function run() {
  await testAttributionResolution();
  await testDatabaseEndToEnd();
}

run().catch(console.error);
