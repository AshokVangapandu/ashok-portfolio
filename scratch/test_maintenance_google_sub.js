// Scratch verification script for Maintenance Page Google Sign-In Integration
const fs = require('fs');
const path = require('path');

console.log('Verifying Maintenance Page Google Sign-In Integration...\n');

const checks = [
  {
    file: 'src/pages/maintenance/MaintenancePage.tsx',
    mustInclude: [
      'useAuth',
      'Continue with Google',
      '✓ Signed in',
      'Not your account? Sign Out',
      'maintenanceService.subscribeToNotify'
    ],
    mustNotInclude: [
      'placeholder="Enter your email address"'
    ]
  },
  {
    file: 'js/components/visibility-guard.js',
    mustInclude: [
      'signInWithGoogle',
      '✓ Signed in',
      'Not your account? Sign Out',
      'data-user-email'
    ],
    mustNotInclude: [
      'id="maint-email-input"'
    ]
  }
];

let allPassed = true;

checks.forEach(({ file, mustInclude, mustNotInclude }) => {
  const fullPath = path.join(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) {
    console.error(`✗ File missing: ${file}`);
    allPassed = false;
    return;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  
  const missing = mustInclude.filter(str => !content.includes(str));
  const forbiddenFound = mustNotInclude.filter(str => content.includes(str));

  if (missing.length === 0 && forbiddenFound.length === 0) {
    console.log(`✓ ${file}: Maintenance Google Sign-In subscription integration verified.`);
  } else {
    if (missing.length > 0) {
      console.error(`✗ ${file}: Missing elements: ${missing.join(', ')}`);
    }
    if (forbiddenFound.length > 0) {
      console.error(`✗ ${file}: Found forbidden manual email input elements: ${forbiddenFound.join(', ')}`);
    }
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\nSUCCESS: All Maintenance Page Google Sign-In subscription requirements verified!');
} else {
  console.error('\nFAILURE: Maintenance Page checks failed.');
  process.exit(1);
}
