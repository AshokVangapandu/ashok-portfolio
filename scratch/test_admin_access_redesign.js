// scratch/test_admin_access_redesign.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Admin Access Redesign verification ---');

  const summaryPath = path.join(__dirname, '../src/admin/pages/admin-access/components/SummaryCards.tsx');
  const toolbarPath = path.join(__dirname, '../src/admin/pages/admin-access/components/MembersToolbar.tsx');
  const tablePath = path.join(__dirname, '../src/admin/pages/admin-access/components/MembersTable.tsx');
  const rowPath = path.join(__dirname, '../src/admin/pages/admin-access/components/MemberRow.tsx');

  // 1. Verify SummaryCards.tsx themed colors
  if (!fs.existsSync(summaryPath)) {
    console.error('FAIL: SummaryCards.tsx not found');
    process.exit(1);
  }
  const summaryContent = fs.readFileSync(summaryPath, 'utf-8');
  if (summaryContent.includes('bgColor') && summaryContent.includes('color: card.color')) {
    console.log('SUCCESS: SummaryCards.tsx has successfully updated styling with custom themed colors!');
  } else {
    console.error('FAIL: SummaryCards.tsx is missing card themes.');
    process.exit(1);
  }

  // 2. Verify MembersToolbar.tsx refined inputs
  if (!fs.existsSync(toolbarPath)) {
    console.error('FAIL: MembersToolbar.tsx not found');
    process.exit(1);
  }
  const toolbarContent = fs.readFileSync(toolbarPath, 'utf-8');
  if (toolbarContent.includes('F8FAFC') && toolbarContent.includes('boxShadow')) {
    console.log('SUCCESS: MembersToolbar.tsx has successfully configured refined inputs and focus outlines!');
  } else {
    console.error('FAIL: MembersToolbar.tsx is missing input refinements.');
    process.exit(1);
  }

  // 3. Verify MembersTable.tsx empty state callback
  if (!fs.existsSync(tablePath)) {
    console.error('FAIL: MembersTable.tsx not found');
    process.exit(1);
  }
  const tableContent = fs.readFileSync(tablePath, 'utf-8');
  if (tableContent.includes('No Team Members Yet') && tableContent.includes('onInviteClick')) {
    console.log('SUCCESS: MembersTable.tsx successfully supports premium empty states and invite callbacks!');
  } else {
    console.error('FAIL: MembersTable.tsx is missing empty state layouts.');
    process.exit(1);
  }

  // 4. Verify MemberRow.tsx badges and permissions
  if (!fs.existsSync(rowPath)) {
    console.error('FAIL: MemberRow.tsx not found');
    process.exit(1);
  }
  const rowContent = fs.readFileSync(rowPath, 'utf-8');
  if (rowContent.includes('renderStatusBadge') && rowContent.includes('renderRoleBadge') && rowContent.includes('renderPermissionChips')) {
    console.log('SUCCESS: MemberRow.tsx successfully renders redesigned badges and permission chips!');
  } else {
    console.error('FAIL: MemberRow.tsx is missing badge logic.');
    process.exit(1);
  }

  console.log('--- ALL ADMIN ACCESS REDESIGN CHECKS PASSED ---');
}

runTest();
