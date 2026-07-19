// scratch/test_popup_clipping_fix.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Sidebar Popup Visibility verification ---');

  const sidebarPath = path.join(__dirname, '../src/admin/layout/Sidebar.tsx');

  if (!fs.existsSync(sidebarPath)) {
    console.error('FAIL: Sidebar.tsx not found');
    process.exit(1);
  }
  const content = fs.readFileSync(sidebarPath, 'utf-8');

  // 1. Verify zIndex of aside element
  if (content.includes('zIndex: 1010,')) {
    console.log('SUCCESS: Sidebar aside z-index is set to 1010 to sit above top navbar headers!');
  } else {
    console.error('FAIL: Sidebar aside z-index is not set to 1010.');
    process.exit(1);
  }

  // 2. Verify overflow of aside element
  if (content.includes("overflow: 'visible',")) {
    console.log('SUCCESS: Sidebar aside overflow is set to visible to allow hover popups to extend outwards!');
  } else {
    console.error('FAIL: Sidebar aside overflow is not visible.');
    process.exit(1);
  }

  // 3. Verify overflow of .premium-menu-list
  if (content.includes('overflow: visible;')) {
    console.log('SUCCESS: Sidebar menu-list class has overflow set to visible to prevent horizontal clipping!');
  } else {
    console.error('FAIL: Menu-list overflow style is not visible.');
    process.exit(1);
  }

  console.log('--- ALL POPUP CLIPPING FIX CHECKS PASSED ---');
}

runTest();
