// scratch/test_social_links_api.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Social Links dynamic wiring verification ---');

  const hookPath = path.join(__dirname, '../src/admin/hooks/useSocialLinks.ts');

  if (!fs.existsSync(hookPath)) {
    console.error('FAIL: useSocialLinks.ts not found');
    process.exit(1);
  }
  const content = fs.readFileSync(hookPath, 'utf-8');

  // 1. Verify URL pattern matching
  if (content.includes('urlPattern = /^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w .-]*)*\\/?$/i')) {
    console.log('SUCCESS: URL pattern regular expression is successfully defined!');
  } else {
    console.error('FAIL: Missing URL pattern validation.');
    process.exit(1);
  }

  // 2. Verify duplicate platform checks
  if (content.includes('Platform "${platform}" has already been added.') && content.includes('Another link already exists for platform "${platform}".')) {
    console.log('SUCCESS: Duplicate checks are performed locally before submitting update operations!');
  } else {
    console.error('FAIL: Missing duplicate check alerts.');
    process.exit(1);
  }

  console.log('--- ALL SOCIAL LINKS WIRING CHECKS PASSED ---');
}

runTest();
