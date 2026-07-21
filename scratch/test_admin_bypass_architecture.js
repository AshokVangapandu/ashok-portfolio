// Scratch script to verify Admin Bypass Architecture implementation
const fs = require('fs');
const path = require('path');

console.log('Verifying Admin Bypass Architecture implementation...\n');

const checks = [
  {
    file: 'src/components/routing/GlobalRouteGuard.tsx',
    mustInclude: ['useAuth', 'isAdmin', 'if (isAdmin)']
  },
  {
    file: 'js/components/visibility-guard.js',
    mustInclude: ['checkAdminBypass', 'sessionStorage.getItem(`is_admin_${userEmail}`)', 'if (isAdmin)']
  },
  {
    file: 'src/projects-main.tsx',
    mustInclude: ['AuthProvider']
  },
  {
    file: 'src/tools-main.tsx',
    mustInclude: ['AuthProvider']
  },
  {
    file: 'src/certifications-main.tsx',
    mustInclude: ['AuthProvider']
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
    console.log(`✓ ${file}: All required code patterns present.`);
  } else {
    console.error(`✗ ${file}: Missing expected patterns: ${missing.join(', ')}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\nSUCCESS: All Admin Bypass Architecture requirements verified!');
} else {
  console.error('\nFAILURE: Verification checks failed.');
  process.exit(1);
}
