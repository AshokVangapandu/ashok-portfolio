// scratch/test_final_ui_polish.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Settings Module UI Polish verification ---');

  const pSettings = path.join(__dirname, '../src/admin/pages/settings/PortfolioSettingsPage.tsx');
  const sLinks = path.join(__dirname, '../src/admin/pages/social-links/SocialLinksPage.tsx');
  const aAccess = path.join(__dirname, '../src/admin/pages/admin-access/AdminAccessPage.tsx');

  // 1. Verify container wrappers match in gap and flex direction
  const files = [pSettings, sLinks, aAccess];
  files.forEach(f => {
    if (!fs.existsSync(f)) {
      console.error(`FAIL: ${path.basename(f)} not found`);
      process.exit(1);
    }
    const content = fs.readFileSync(f, 'utf-8');
    if (content.includes("gap: 'var(--admin-space-6)'") && content.includes("display: 'flex'") && content.includes("flexDirection: 'column'")) {
      console.log(`SUCCESS: ${path.basename(f)} uses the standard gap and flex direction page container wrapper!`);
    } else {
      console.error(`FAIL: ${path.basename(f)} container wrapper is inconsistent.`);
      process.exit(1);
    }
  });

  // 2. Verify button components in Social Links and Admin Access are visually matched
  const addNewBtnPath = path.join(__dirname, '../src/admin/pages/social-links/components/AddNewLinkButton.tsx');
  if (!fs.existsSync(addNewBtnPath)) {
    console.error('FAIL: AddNewLinkButton.tsx not found');
    process.exit(1);
  }
  const btnContent = fs.readFileSync(addNewBtnPath, 'utf-8');
  if (btnContent.includes('var(--admin-primary)') && btnContent.includes('boxShadow') && btnContent.includes('animate-glow')) {
    console.log('SUCCESS: AddNewLinkButton is visually consistent with access control invite buttons!');
  } else {
    console.error('FAIL: AddNewLinkButton does not match the prominent button design system.');
    process.exit(1);
  }

  console.log('--- ALL SETTINGS MODULE POLISH CHECKS PASSED ---');
}

runTest();
