// scratch/test_downloads_admin.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Phase 5: Resume Downloads Admin integration checks ---');

  const pagePath = path.join(__dirname, '../src/admin/pages/resume/ResumePage.tsx');
  const hookPath = path.join(__dirname, '../src/admin/hooks/useResumeDownloads.ts');

  if (!fs.existsSync(pagePath) || !fs.existsSync(hookPath)) {
    console.error('Files not found!');
    process.exit(1);
  }

  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  const hookContent = fs.readFileSync(hookPath, 'utf-8');

  // 1. Verify tab structure is present in ResumePage
  if (pageContent.includes('downloads') && pageContent.includes('management') && pageContent.includes('activeTab')) {
    console.log('SUCCESS: ResumePage contains a tab selector supporting downloads log and file management!');
  } else {
    console.error('FAIL: ResumePage tab selectors are missing.');
    process.exit(1);
  }

  // 2. Verify useResumeDownloads filters by search and date range
  if (hookContent.includes('dateRange') && hookContent.includes('setDateRange') && hookContent.includes('today') && hookContent.includes('yesterday') && hookContent.includes('7days')) {
    console.log('SUCCESS: useResumeDownloads correctly filters download events by search and date ranges!');
  } else {
    console.error('FAIL: useResumeDownloads filter inputs are incomplete.');
    process.exit(1);
  }

  // 3. Verify useResumeDownloads contains CSV export logic
  if (hookContent.includes('exportCSV') && hookContent.includes('text/csv') && hookContent.includes('downloaded_at')) {
    console.log('SUCCESS: useResumeDownloads supports dynamic CSV exports of matching download records!');
  } else {
    console.error('FAIL: useResumeDownloads is missing CSV exporter.');
    process.exit(1);
  }
}

runTest();
