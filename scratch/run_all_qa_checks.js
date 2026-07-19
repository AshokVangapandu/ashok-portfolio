// scratch/run_all_qa_checks.js
const { execSync } = require('child_process');
const path = require('path');

function runCheck(scriptName) {
  console.log(`Running: ${scriptName}...`);
  try {
    const output = execSync(`node ${path.join(__dirname, scriptName)}`, { encoding: 'utf-8' });
    console.log(output);
    return true;
  } catch (error) {
    console.error(`FAIL: ${scriptName} failed!`);
    console.error(error.stdout || error.message);
    return false;
  }
}

function runAll() {
  console.log('=== Master Settings Module QA Checklist ===');
  
  const scripts = [
    'test_collapsed_floating_submenu.js',
    'test_popup_clipping_fix.js',
    'test_dynamic_settings.js',
    'test_social_links_api.js',
    'test_admin_access_api.js'
  ];

  let allPassed = true;
  for (const s of scripts) {
    const passed = runCheck(s);
    if (!passed) allPassed = false;
  }

  if (allPassed) {
    console.log('=== ALL QA VERIFICATIONS COMPLETED SUCCESSFULLY ===');
  } else {
    console.error('=== QA CHECK VERIFICATIONS FAILED ===');
    process.exit(1);
  }
}

runAll();
