const path = require('path');
const resolverPath = path.resolve(__dirname, '../js/utilities/attribution.js');

async function runTests() {
  console.log('Loading resolveTrafficSource from:', resolverPath);
  const { resolveTrafficSource } = await import(`file://${resolverPath}`);

  const testCases = [
    {
      name: 'UTM only',
      referrer: '',
      search: '?utm_source=Resume&utm_medium=document&utm_campaign=jobhunt',
      expected: {
        source: 'Resume',
        medium: 'document',
        campaign: 'jobhunt',
        content: null,
        term: null,
        referrer: '',
        hasUTM: true,
        hasReferrer: false,
        attributionType: 'utm'
      }
    },
    {
      name: 'Referrer only',
      referrer: 'https://www.linkedin.com/',
      search: '',
      expected: {
        source: 'LinkedIn',
        medium: 'social',
        campaign: null,
        content: null,
        term: null,
        referrer: 'https://www.linkedin.com/',
        hasUTM: false,
        hasReferrer: true,
        attributionType: 'referrer'
      }
    },
    {
      name: 'Both present (UTM wins)',
      referrer: 'https://www.google.co.in/',
      search: '?utm_source=linkedin&utm_medium=social&utm_campaign=hiring_post',
      expected: {
        source: 'LinkedIn', // normalized from 'linkedin'
        medium: 'social',
        campaign: 'hiring_post',
        content: null,
        term: null,
        referrer: 'https://www.google.co.in/',
        hasUTM: true,
        hasReferrer: true,
        attributionType: 'utm'
      }
    },
    {
      name: 'Neither present (Direct)',
      referrer: '',
      search: '',
      expected: {
        source: 'Direct',
        medium: null,
        campaign: null,
        content: null,
        term: null,
        referrer: '',
        hasUTM: false,
        hasReferrer: false,
        attributionType: 'direct'
      }
    },
    {
      name: 'Unknown referrer',
      referrer: 'https://stackoverflow.com/questions/123',
      search: '',
      expected: {
        source: 'Referral (stackoverflow.com)',
        medium: 'referral',
        campaign: null,
        content: null,
        term: null,
        referrer: 'https://stackoverflow.com/questions/123',
        hasUTM: false,
        hasReferrer: true,
        attributionType: 'referrer'
      }
    },
    {
      name: 'Unknown utm_source (preserve original)',
      referrer: 'https://www.github.com/',
      search: '?utm_source=custom_newsletter&utm_campaign=update_v2',
      expected: {
        source: 'custom_newsletter',
        medium: null,
        campaign: 'update_v2',
        content: null,
        term: null,
        referrer: 'https://www.github.com/',
        hasUTM: true,
        hasReferrer: true,
        attributionType: 'utm'
      }
    }
  ];

  let failed = 0;

  for (const tc of testCases) {
    const result = resolveTrafficSource(tc.referrer, tc.search);

    let match = true;
    for (const key of Object.keys(tc.expected)) {
      if (result[key] !== tc.expected[key]) {
        match = false;
        break;
      }
    }

    if (match) {
      console.log(`✅ PASS: ${tc.name}`);
    } else {
      console.error(`❌ FAIL: ${tc.name}`);
      console.error('  Expected:', tc.expected);
      console.error('  Received:', result);
      failed++;
    }
  }

  if (failed === 0) {
    console.log('\n🎉 ALL RESOLVER TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error(`\n❌ ${failed} TESTS FAILED.`);
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed with error:', err);
  process.exit(1);
});
