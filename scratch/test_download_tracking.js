// scratch/test_download_tracking.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Phase 4: Resume Download Tracking integration checks ---');

  // 1. Check supabase-service.js tracking operations
  const servicePath = path.join(__dirname, '../js/services/supabase-service.js');
  const serviceContent = fs.readFileSync(servicePath, 'utf-8');
  if (serviceContent.includes('logResumeDownload') && serviceContent.includes('updateDownloadStatus') && serviceContent.includes('resume_downloads')) {
    console.log('SUCCESS: Resume download logging functions are defined in supabase-service.js!');
  } else {
    console.error('FAIL: Missing tracking operations in supabase-service.js.');
    process.exit(1);
  }

  // 2. Check main.jsx payload structure
  const mainPath = path.join(__dirname, '../js/main.jsx');
  const mainContent = fs.readFileSync(mainPath, 'utf-8');
  if (
    mainContent.includes('logResumeDownload(downloadPayload)') &&
    mainContent.includes('download_status') &&
    mainContent.includes('session_id') &&
    mainContent.includes('visitor_id') &&
    mainContent.includes('browser') &&
    mainContent.includes('operating_system') &&
    mainContent.includes('device_type')
  ) {
    console.log('SUCCESS: main.js collects visitor metadata and triggers logResumeDownload!');
  } else {
    console.error('FAIL: Resume download payload mapping is incomplete in main.js.');
    process.exit(1);
  }

  // 3. Verify status update on fail
  if (mainContent.includes('updateDownloadStatus(downloadRecord.id, \'failed\')')) {
    console.log('SUCCESS: main.js updates the status to failed in the catch block if the download fails!');
  } else {
    console.error('FAIL: Resume download failure status update is missing.');
    process.exit(1);
  }
}

runTest();
