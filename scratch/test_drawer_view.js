// scratch/test_drawer_view.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Phase 6: Drawer View checks ---');

  const filePath = path.join(__dirname, '../src/admin/pages/resume/components/DownloadDetailsModal.tsx');
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Verify that it renders aside as a right-side drawer
  if (content.includes('position: \'fixed\'') && content.includes('right: 0') && content.includes('width: \'460px\'')) {
    console.log('SUCCESS: DownloadDetailsModal correctly renders a right-side slide-in drawer!');
  } else {
    console.error('FAIL: Right-side drawer CSS styles are missing.');
    process.exit(1);
  }

  // Verify all details fields are printed
  const requiredFields = [
    'resumeVersion',
    'dateTime',
    'visitorName',
    'device',
    'browser',
    'os',
    'country',
    'city',
    'referrer',
    'pageSource',
    'downloadedFrom',
    'sessionId',
    'userAgent',
    'ipAddress'
  ];

  let missing = false;
  requiredFields.forEach(field => {
    if (!content.includes(field)) {
      console.error(`FAIL: Missing field '${field}' inside the drawer!`);
      missing = true;
    }
  });

  if (!missing) {
    console.log('SUCCESS: All visitor, session, and browser metadata fields are printed in the drawer details list!');
  } else {
    process.exit(1);
  }
}

runTest();
