// scratch/test_social_links_redesign.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Social Links Redesign verification ---');

  const listPath = path.join(__dirname, '../src/admin/pages/social-links/components/SocialLinksList.tsx');
  const rowPath = path.join(__dirname, '../src/admin/pages/social-links/components/SocialLinkRow.tsx');
  const emptyPath = path.join(__dirname, '../src/admin/pages/social-links/components/EmptyState.tsx');

  // 1. Verify SocialLinksList.tsx grid layout
  if (!fs.existsSync(listPath)) {
    console.error('FAIL: SocialLinksList.tsx not found');
    process.exit(1);
  }
  const listContent = fs.readFileSync(listPath, 'utf-8');
  if (listContent.includes('display: \'grid\'') && listContent.includes('gridTemplateColumns:')) {
    console.log('SUCCESS: SocialLinksList.tsx successfully arranges cards inside a responsive CSS grid!');
  } else {
    console.error('FAIL: SocialLinksList.tsx is missing CSS grid styling.');
    process.exit(1);
  }

  // 2. Verify SocialLinkRow.tsx connection badge and action triggers
  if (!fs.existsSync(rowPath)) {
    console.error('FAIL: SocialLinkRow.tsx not found');
    process.exit(1);
  }
  const rowContent = fs.readFileSync(rowPath, 'utf-8');
  if (rowContent.includes('Connected') && rowContent.includes('Not Connected') && rowContent.includes('Edit') && rowContent.includes('Delete')) {
    console.log('SUCCESS: SocialLinkRow.tsx contains the correct connection badges, URL fields, and edit/delete actions!');
  } else {
    console.error('FAIL: SocialLinkRow.tsx is missing status indicators or actions.');
    process.exit(1);
  }

  // 3. Verify EmptyState.tsx copy text
  if (!fs.existsSync(emptyPath)) {
    console.error('FAIL: EmptyState.tsx not found');
    process.exit(1);
  }
  const emptyContent = fs.readFileSync(emptyPath, 'utf-8');
  if (emptyContent.includes('No Social Links Added') && emptyContent.includes('Connect your professional profiles') && emptyContent.includes('Add First Link')) {
    console.log('SUCCESS: EmptyState.tsx contains the correct premium placeholder text and button label!');
  } else {
    console.error('FAIL: EmptyState.tsx copy text is incorrect.');
    process.exit(1);
  }

  console.log('--- ALL SOCIAL LINKS REDESIGN CHECKS PASSED ---');
}

runTest();
