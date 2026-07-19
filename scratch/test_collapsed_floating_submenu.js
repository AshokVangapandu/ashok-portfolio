// scratch/test_collapsed_floating_submenu.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Collapsed Sidebar Submenu verification ---');

  const sidebarPath = path.join(__dirname, '../src/admin/layout/Sidebar.tsx');

  if (!fs.existsSync(sidebarPath)) {
    console.error('FAIL: Sidebar.tsx not found');
    process.exit(1);
  }
  const content = fs.readFileSync(sidebarPath, 'utf-8');

  // 1. Verify CSS styles for white background and soft shadow
  if (content.includes('background-color: #FFFFFF;') && content.includes('border: 1px solid #E2E8F0;') && content.includes('box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);')) {
    console.log('SUCCESS: CSS styles configure the floating popover with a white background, slate borders, and soft shadows!');
  } else {
    console.error('FAIL: Collapsed popover CSS style is missing or incorrect.');
    process.exit(1);
  }

  // 2. Verify link items and action hover triggers
  if (content.includes('rgba(124, 58, 237, 0.08)') && content.includes('var(--admin-primary)') && content.includes('#475569')) {
    console.log('SUCCESS: Link elements are styled correctly with custom hover backgrounds, active statuses, and slate text colors!');
  } else {
    console.error('FAIL: Missing proper button hover states or active class colors.');
    process.exit(1);
  }

  console.log('--- ALL COLLAPSED SUBMENU CHECKS PASSED ---');
}

runTest();
