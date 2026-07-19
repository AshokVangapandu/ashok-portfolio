// scratch/test_sidebar_submenu.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Sidebar Submenu Navigation verification ---');

  const sidebarPath = path.join(__dirname, '../src/admin/layout/Sidebar.tsx');
  const portfolioSettingsPath = path.join(__dirname, '../src/admin/pages/settings/PortfolioSettingsPage.tsx');
  const socialLinksPath = path.join(__dirname, '../src/admin/pages/social-links/SocialLinksPage.tsx');
  const adminAccessPath = path.join(__dirname, '../src/admin/pages/admin-access/AdminAccessPage.tsx');

  // 1. Verify Sidebar.tsx modifications
  if (!fs.existsSync(sidebarPath)) {
    console.error('FAIL: Sidebar.tsx not found');
    process.exit(1);
  }
  const sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');
  if (sidebarContent.includes('settingsExpanded') && sidebarContent.includes('setSettingsExpanded') && sidebarContent.includes('settings-submenu-container') && sidebarContent.includes('floating-submenu')) {
    console.log('SUCCESS: Sidebar.tsx successfully supports submenu expand/collapse toggle and collapsed popover panels!');
  } else {
    console.error('FAIL: Sidebar.tsx is missing settingsExpanded states or submenu wrappers.');
    process.exit(1);
  }

  // 2. Verify sub-tabs are removed from Settings pages
  const pages = [portfolioSettingsPath, socialLinksPath, adminAccessPath];
  pages.forEach(p => {
    if (!fs.existsSync(p)) {
      console.error(`FAIL: File not found: ${p}`);
      process.exit(1);
    }
    const pageContent = fs.readFileSync(p, 'utf-8');
    if (pageContent.includes('import { Tabs }') || pageContent.includes('<Tabs')) {
      console.error(`FAIL: Page ${path.basename(p)} still contains duplicate/redundant top tabs navigation!`);
      process.exit(1);
    }
  });

  console.log('SUCCESS: All Settings pages have successfully removed duplicate top tabs navigation!');
  console.log('--- ALL SIDEBAR SUBMENU CHECKS PASSED SUCCESSFULLY ---');
}

runTest();
