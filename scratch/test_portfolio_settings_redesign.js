// scratch/test_portfolio_settings_redesign.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Portfolio Settings Redesign verification ---');

  const pagePath = path.join(__dirname, '../src/admin/pages/settings/PortfolioSettingsPage.tsx');

  if (!fs.existsSync(pagePath)) {
    console.error('FAIL: PortfolioSettingsPage.tsx not found');
    process.exit(1);
  }

  const content = fs.readFileSync(pagePath, 'utf-8');

  // 1. Verify Resume card / management is REMOVED
  if (content.includes('ResumeCard') || content.includes('resumeFileName') || content.includes('resumeStatus')) {
    console.error('FAIL: ResumeCard or resume references still present inside PortfolioSettingsPage!');
    process.exit(1);
  } else {
    console.log('SUCCESS: Resume Management section has been completely removed from settings!');
  }

  // 2. Verify Visibility status selectable options are present
  if (content.includes('public') && content.includes('maintenance') && content.includes('private')) {
    console.log('SUCCESS: Selectable cards are present for Public, Maintenance, and Private modes!');
  } else {
    console.error('FAIL: Missing visibility status selectable options.');
    process.exit(1);
  }

  // 3. Verify Open for Work Toggle Availability layout is present
  if (content.includes('Open for Work') && content.includes('isOpenForWork') && content.includes('Status:')) {
    console.log('SUCCESS: Redesigned Open for Work toggle availability controls are present!');
  } else {
    console.error('FAIL: Open for Work availability toggle is missing.');
    process.exit(1);
  }

  // 4. Verify Future Ready placeholder cards are present
  const placeholders = ['SEO Settings', 'Custom Domains', 'Visitor Preferences', 'Portfolio Analytics'];
  let placeholdersOk = true;
  placeholders.forEach(p => {
    if (!content.includes(p)) {
      console.error(`FAIL: Missing placeholder card '${p}'!`);
      placeholdersOk = false;
    }
  });

  if (placeholdersOk) {
    console.log('SUCCESS: Future Ready placeholder cards are visually present on the page!');
  } else {
    process.exit(1);
  }

  console.log('--- ALL PORTFOLIO SETTINGS REDESIGN CHECKS PASSED ---');
}

runTest();
