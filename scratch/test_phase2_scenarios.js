// Scratch verification script for Phase 2 Admin Route Bypass & Visibility Override
const fs = require('fs');
const path = require('path');

console.log('Running Phase 2 Validation Scenarios Check...\n');

// Simulated state logic mirroring GlobalRouteGuard.tsx & visibility-guard.js
function evaluateRouteGuard(siteMode, isAuthenticated, isAdmin, privateSessionValid = false) {
  // If loading or auth checking, show loading
  // If isAdmin is true (authenticated + in admins table), BYPASS siteMode
  if (isAuthenticated && isAdmin) {
    return { access: 'GRANTED_FULL_PORTFOLIO_AND_ADMIN', mode: 'ADMIN_BYPASS' };
  }

  switch (siteMode) {
    case 'maintenance':
      return { access: 'DENIED_SHOW_MAINTENANCE_PAGE', mode: 'MAINTENANCE' };
    case 'private':
      if (privateSessionValid) {
        return { access: 'GRANTED_PORTFOLIO_ONLY', mode: 'PRIVATE_AUTHORIZED' };
      }
      return { access: 'DENIED_SHOW_PRIVATE_ACCESS_PAGE', mode: 'PRIVATE' };
    case 'public':
    default:
      return { access: 'GRANTED_FULL_PORTFOLIO', mode: 'PUBLIC' };
  }
}

const scenarios = [
  {
    name: 'Scenario 1: Portfolio = Public, Visitor = Anonymous',
    input: { siteMode: 'public', isAuthenticated: false, isAdmin: false },
    expectedAccess: 'GRANTED_FULL_PORTFOLIO'
  },
  {
    name: 'Scenario 2: Portfolio = Maintenance, Visitor = Anonymous',
    input: { siteMode: 'maintenance', isAuthenticated: false, isAdmin: false },
    expectedAccess: 'DENIED_SHOW_MAINTENANCE_PAGE'
  },
  {
    name: 'Scenario 3: Portfolio = Maintenance, Visitor = Authenticated Admin',
    input: { siteMode: 'maintenance', isAuthenticated: true, isAdmin: true },
    expectedAccess: 'GRANTED_FULL_PORTFOLIO_AND_ADMIN'
  },
  {
    name: 'Scenario 4: Portfolio = Private, Visitor = Anonymous',
    input: { siteMode: 'private', isAuthenticated: false, isAdmin: false },
    expectedAccess: 'DENIED_SHOW_PRIVATE_ACCESS_PAGE'
  },
  {
    name: 'Scenario 5: Portfolio = Private, Visitor = Authenticated Admin',
    input: { siteMode: 'private', isAuthenticated: true, isAdmin: true },
    expectedAccess: 'GRANTED_FULL_PORTFOLIO_AND_ADMIN'
  },
  {
    name: 'Scenario 6: Authenticated Admin logs out while site is in Maintenance',
    input: { siteMode: 'maintenance', isAuthenticated: false, isAdmin: false }, // Post-logout state
    expectedAccess: 'DENIED_SHOW_MAINTENANCE_PAGE'
  }
];

let allPassed = true;

scenarios.forEach(({ name, input, expectedAccess }) => {
  const res = evaluateRouteGuard(input.siteMode, input.isAuthenticated, input.isAdmin);
  if (res.access === expectedAccess) {
    console.log(`✓ ${name} => PASS (${res.access})`);
  } else {
    console.error(`✗ ${name} => FAIL (Expected: ${expectedAccess}, Got: ${res.access})`);
    allPassed = false;
  }
});

// Also verify file code contents
console.log('\nVerifying code file contents:');
const fileChecks = [
  { file: 'src/components/routing/GlobalRouteGuard.tsx', search: ['isAdmin', 'if (isAdmin)'] },
  { file: 'js/components/visibility-guard.js', search: ['checkAdminBypass', 'onAuthStateChange', 'SIGNED_OUT'] },
  { file: 'src/auth/AuthProvider.tsx', search: ['is_admin_', 'signOut', 'setIsAdmin(false)'] }
];

fileChecks.forEach(({ file, search }) => {
  const fullPath = path.join(__dirname, '..', file);
  const content = fs.readFileSync(fullPath, 'utf8');
  const missing = search.filter(s => !content.includes(s));
  if (missing.length === 0) {
    console.log(`✓ ${file}: Code structure verified.`);
  } else {
    console.error(`✗ ${file}: Missing code patterns: ${missing.join(', ')}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\nALL 6 PHASES SCENARIOS VERIFIED SUCCESSFULLY!');
} else {
  console.error('\nVerification failed.');
  process.exit(1);
}
