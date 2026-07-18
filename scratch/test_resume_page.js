// scratch/test_resume_page.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Phase 2: Resume settings page component integration checks ---');

  const pagePath = path.join(__dirname, '../src/admin/pages/resume/ResumePage.tsx');
  if (!fs.existsSync(pagePath)) {
    console.error('File not found:', pagePath);
    process.exit(1);
  }

  const content = fs.readFileSync(pagePath, 'utf-8');

  // Verify that ResumePage is connected to resumeService
  if (content.includes('resumeService.uploadResume') && content.includes('resumeService.setActiveResume') && content.includes('resumeService.deleteResume')) {
    console.log('SUCCESS: ResumePage is correctly integrated with resumeService CRUD functions!');
  } else {
    console.error('FAIL: ResumePage integration with resumeService is missing.');
    process.exit(1);
  }

  // Verify that the table and modal sub-components are imported
  if (content.includes('ResumeSettingsTable') && content.includes('UploadResumeModal') && content.includes('ResumeDetailsModal')) {
    console.log('SUCCESS: Table and Modal sub-components are successfully integrated into the page view!');
  } else {
    console.error('FAIL: Missing child component imports.');
    process.exit(1);
  }
}

runTest();
