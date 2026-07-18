// scratch/test_settings_tabs.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Settings Sub-tabs verification ---');

  const files = [
    {
      name: 'PortfolioSettingsPage.tsx',
      path: path.join(__dirname, '../src/admin/pages/settings/PortfolioSettingsPage.tsx'),
      activeId: 'portfolio'
    },
    {
      name: 'SocialLinksPage.tsx',
      path: path.join(__dirname, '../src/admin/pages/social-links/SocialLinksPage.tsx'),
      activeId: 'social-links'
    },
    {
      name: 'AdminAccessPage.tsx',
      path: path.join(__dirname, '../src/admin/pages/admin-access/AdminAccessPage.tsx'),
      activeId: 'admin-access'
    }
  ];

  files.forEach(f => {
    if (!fs.existsSync(f.path)) {
      console.error(`FAIL: File not found: ${f.name}`);
      process.exit(1);
    }
    const content = fs.readFileSync(f.path, 'utf-8');

    // 1. Verify Tabs import
    if (content.includes('import { Tabs }') || content.includes('import Tabs')) {
      console.log(`SUCCESS: ${f.name} imports the Tabs component!`);
    } else {
      console.error(`FAIL: ${f.name} is missing the Tabs import statement.`);
      process.exit(1);
    }

    // 2. Verify activeId is correctly bound
    if (content.includes(`activeId="${f.activeId}"`)) {
      console.log(`SUCCESS: ${f.name} binds activeId correctly to '${f.activeId}'!`);
    } else {
      console.error(`FAIL: ${f.name} activeId binding is incorrect.`);
      process.exit(1);
    }

    // 3. Verify onChange trigger dispatches popstate
    if (content.includes('window.dispatchEvent(new PopStateEvent(\'popstate\'))')) {
      console.log(`SUCCESS: ${f.name} handles onChange navigation and dispatches router popstate events!`);
    } else {
      console.error(`FAIL: ${f.name} is missing navigation trigger logic.`);
      process.exit(1);
    }
  });

  console.log('--- ALL SETTINGS TABS CHECKS PASSED SUCCESSFULLY ---');
}

runTest();
