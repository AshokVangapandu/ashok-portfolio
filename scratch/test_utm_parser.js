const path = require('path');
const utmPath = path.resolve(__dirname, '../js/utilities/utm.js');

async function runTests() {
  console.log('Loading resolveUTMParameters from:', utmPath);
  const { resolveUTMParameters } = await import(`file://${utmPath}`);

  const testCases = [
    {
      name: 'No UTM parameters',
      input: 'https://portfolio.com',
      expected: {
        source: null,
        medium: null,
        campaign: null,
        content: null,
        term: null,
        hasUTM: false
      }
    },
    {
      name: 'utm_source = linkedin (lowercase)',
      input: 'https://portfolio.com/?utm_source=linkedin',
      expected: {
        source: 'LinkedIn',
        medium: null,
        campaign: null,
        content: null,
        term: null,
        hasUTM: true
      }
    },
    {
      name: 'utm_source = LINKEDIN (uppercase)',
      input: 'https://portfolio.com/?utm_source=LINKEDIN',
      expected: {
        source: 'LinkedIn',
        medium: null,
        campaign: null,
        content: null,
        term: null,
        hasUTM: true
      }
    },
    {
      name: 'utm_source = resume & utm_campaign = jobhunt',
      input: 'https://portfolio.com/?utm_source=resume&utm_campaign=jobhunt',
      expected: {
        source: 'Resume',
        medium: null,
        campaign: 'jobhunt',
        content: null,
        term: null,
        hasUTM: true
      }
    },
    {
      name: 'utm_source = github & utm_medium = profile',
      input: 'https://portfolio.com/?utm_source=github&utm_medium=profile',
      expected: {
        source: 'GitHub',
        medium: 'profile',
        campaign: null,
        content: null,
        term: null,
        hasUTM: true
      }
    },
    {
      name: 'unknown utm_source (should preserve)',
      input: 'https://portfolio.com/?utm_source=custom-newsletter&utm_medium=email&utm_campaign=august_updates',
      expected: {
        source: 'custom-newsletter',
        medium: 'email',
        campaign: 'august_updates',
        content: null,
        term: null,
        hasUTM: true
      }
    },
    {
      name: 'All parameters with spaces/trimming',
      input: 'https://portfolio.com/?utm_source=  facebook  &utm_medium=  social  &utm_campaign=  promo  &utm_content=  banner  &utm_term=  react  ',
      expected: {
        source: 'Facebook',
        medium: 'social',
        campaign: 'promo',
        content: 'banner',
        term: 'react',
        hasUTM: true
      }
    }
  ];

  let failed = 0;

  for (const tc of testCases) {
    // Extract query string from mock URL
    const urlObj = new URL(tc.input);
    const searchString = urlObj.search;
    
    const result = resolveUTMParameters(searchString);

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
    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
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
