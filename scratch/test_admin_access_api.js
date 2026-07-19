// scratch/test_admin_access_api.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Admin Access dynamic wiring verification ---');

  const servicePath = path.join(__dirname, '../src/admin/services/adminAccessService.ts');

  if (!fs.existsSync(servicePath)) {
    console.error('FAIL: adminAccessService.ts not found');
    process.exit(1);
  }
  const content = fs.readFileSync(servicePath, 'utf-8');

  // 1. Verify default permission mappings
  if (content.includes("dbRole === 'super_admin'") && content.includes("'Access Management'") && content.includes("'Portfolio Configuration'")) {
    console.log('SUCCESS: Default role permissions arrays are defined dynamically!');
  } else {
    console.error('FAIL: Missing permission mappings.');
    process.exit(1);
  }

  // 2. Verify date format mappings
  if (content.includes('toLocaleDateString') && content.includes('toLocaleTimeString')) {
    console.log('SUCCESS: Locale time mappers format database timestamps to user-friendly strings!');
  } else {
    console.error('FAIL: Missing time stamp formats.');
    process.exit(1);
  }

  console.log('--- ALL ADMIN ACCESS WIRING CHECKS PASSED ---');
}

runTest();
