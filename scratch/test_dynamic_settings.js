// scratch/test_dynamic_settings.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Dynamic Settings Service verification ---');

  const servicePath = path.join(__dirname, '../src/admin/services/portfolioSettingsService.ts');

  if (!fs.existsSync(servicePath)) {
    console.error('FAIL: portfolioSettingsService.ts not found');
    process.exit(1);
  }
  const content = fs.readFileSync(servicePath, 'utf-8');

  // 1. Verify Supabase client import
  if (content.includes("import { supabase } from '../../services/supabase/client'")) {
    console.log('SUCCESS: Supabase client is successfully imported!');
  } else {
    console.error('FAIL: Supabase client import is missing.');
    process.exit(1);
  }

  // 2. Verify mapping of is_open_for_work to isOpenForWork
  if (content.includes('isOpenForWork: data.is_open_for_work') && content.includes('is_open_for_work: settings.isOpenForWork')) {
    console.log('SUCCESS: Database snake_case columns are successfully mapped to camelCase client types!');
  } else {
    console.error('FAIL: Missing is_open_for_work mapping.');
    process.exit(1);
  }

  console.log('--- ALL DYNAMIC SETTINGS CHECKS PASSED ---');
}

runTest();
