const path = require('path');
const referrerPath = path.resolve(__dirname, '../js/utilities/referrer.js');

async function runTests() {
  console.log('Loading resolveReferrer from:', referrerPath);
  const { resolveReferrer } = await import(`file://${referrerPath}`);

  const testCases = [
    {
      name: 'Empty referrer',
      input: '',
      expected: {
        source: 'Direct',
        referrer: '',
        hasReferrer: false
      }
    },
    {
      name: 'LinkedIn referrer',
      input: 'https://www.linkedin.com/',
      expected: {
        source: 'LinkedIn',
        referrer: 'https://www.linkedin.com/',
        hasReferrer: true
      }
    },
    {
      name: 'LinkedIn regional referrer',
      input: 'https://lnkd.in/abc',
      expected: {
        source: 'Referral (lnkd.in)', // wait, lnkd.in matches fallback as it doesn't match linkedin.*
        referrer: 'https://lnkd.in/abc',
        hasReferrer: true
      }
    },
    {
      name: 'LinkedIn co.uk referrer',
      input: 'https://uk.linkedin.com/in/username',
      expected: {
        source: 'LinkedIn',
        referrer: 'https://uk.linkedin.com/in/username',
        hasReferrer: true
      }
    },
    {
      name: 'GitHub referrer',
      input: 'https://github.com/',
      expected: {
        source: 'GitHub',
        referrer: 'https://github.com/',
        hasReferrer: true
      }
    },
    {
      name: 'Google Indian local referrer',
      input: 'https://www.google.co.in/',
      expected: {
        source: 'Google Search',
        referrer: 'https://www.google.co.in/',
        hasReferrer: true
      }
    },
    {
      name: 'Bing search referrer',
      input: 'https://cn.bing.com/search?q=test',
      expected: {
        source: 'Bing',
        referrer: 'https://cn.bing.com/search?q=test',
        hasReferrer: true
      }
    },
    {
      name: 'DuckDuckGo referrer',
      input: 'https://duckduckgo.com/',
      expected: {
        source: 'DuckDuckGo',
        referrer: 'https://duckduckgo.com/',
        hasReferrer: true
      }
    },
    {
      name: 'Reddit referrer',
      input: 'https://www.reddit.com/r/reactjs/',
      expected: {
        source: 'Reddit',
        referrer: 'https://www.reddit.com/r/reactjs/',
        hasReferrer: true
      }
    },
    {
      name: 'Twitter (t.co) link shortener referrer',
      input: 'https://t.co/XYZ123',
      expected: {
        source: 'X (Twitter)',
        referrer: 'https://t.co/XYZ123',
        hasReferrer: true
      }
    },
    {
      name: 'X.com referrer',
      input: 'https://x.com/some/status',
      expected: {
        source: 'X (Twitter)',
        referrer: 'https://x.com/some/status',
        hasReferrer: true
      }
    },
    {
      name: 'Telegram (t.me) referrer',
      input: 'https://t.me/channel',
      expected: {
        source: 'Telegram',
        referrer: 'https://t.me/channel',
        hasReferrer: true
      }
    },
    {
      name: 'Instagram referrer',
      input: 'https://l.instagram.com/',
      expected: {
        source: 'Instagram',
        referrer: 'https://l.instagram.com/',
        hasReferrer: true
      }
    },
    {
      name: 'Unknown domain (stackoverflow)',
      input: 'https://stackoverflow.com/questions/12345',
      expected: {
        source: 'Referral (stackoverflow.com)',
        referrer: 'https://stackoverflow.com/questions/12345',
        hasReferrer: true
      }
    }
  ];

  let failed = 0;

  for (const tc of testCases) {
    const result = resolveReferrer(tc.input);

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
    console.log('\n🎉 ALL REFERRER TESTS PASSED SUCCESSFULLY!');
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
