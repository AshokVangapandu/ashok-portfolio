// Scratch verification script for Phase 3 Admin Experience & Maintenance Mode UX Polish
const fs = require('fs');
const path = require('path');

console.log('Verifying Phase 3 UI Polish & Indicators...\n');

const checks = [
  {
    file: 'src/components/routing/GlobalRouteGuard.tsx',
    mustInclude: ['Admin Mode', 'Admin Preview', 'Portfolio is currently in Maintenance Mode', 'role="status"']
  },
  {
    file: 'js/components/visibility-guard.js',
    mustInclude: ['renderAdminModeBanner', 'admin-bypass-banner', 'Admin Mode', 'Admin Preview']
  },
  {
    file: 'src/admin/pages/settings/components/PortfolioStatusSelector.tsx',
    mustInclude: ['Public Visitors:', 'Administrator:', 'Visibility Preview:']
  },
  {
    file: 'src/admin/hooks/usePortfolioSettings.ts',
    mustInclude: ['Portfolio is now public', 'Maintenance Mode is active', 'Private Mode is active']
  }
];

let allPassed = true;

checks.forEach(({ file, mustInclude }) => {
  const fullPath = path.join(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) {
    console.error(`✗ File missing: ${file}`);
    allPassed = false;
    return;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  const missing = mustInclude.filter(str => !content.includes(str));

  if (missing.length === 0) {
    console.log(`✓ ${file}: All Phase 3 UI elements verified.`);
  } else {
    console.error(`✗ ${file}: Missing UI elements: ${missing.join(', ')}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\nSUCCESS: All Phase 3 UX Polish requirements verified!');
} else {
  console.error('\nFAILURE: Phase 3 checks failed.');
  process.exit(1);
}
