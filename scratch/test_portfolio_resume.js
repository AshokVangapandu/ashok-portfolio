// scratch/test_portfolio_resume.js
const fs = require('fs');
const path = require('path');

function runTest() {
  console.log('--- Phase 3: Portfolio Resume integration checks ---');

  // 1. Check index.html template modifications
  const htmlPath = path.join(__dirname, '../index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  if (htmlContent.includes('<span>View Online</span>') && !htmlContent.includes('<span>View LinkedIn</span>')) {
    console.log('SUCCESS: index.html has replaced LinkedIn action with View Online action!');
  } else {
    console.error('FAIL: index.html modification verification failed.');
    process.exit(1);
  }

  // 2. Check supabase-service.js ResumeService exposure
  const servicePath = path.join(__dirname, '../js/services/supabase-service.js');
  const serviceContent = fs.readFileSync(servicePath, 'utf-8');
  if (serviceContent.includes('ResumeService') && serviceContent.includes('getActiveResume') && serviceContent.includes('from(\'resume_settings\')')) {
    console.log('SUCCESS: window.ResumeService is correctly defined in supabase-service.js!');
  } else {
    console.error('FAIL: ResumeService is missing from supabase-service.js.');
    process.exit(1);
  }

  // 3. Check main.js loadDynamicResume invocation
  const mainPath = path.join(__dirname, '../js/main.js');
  const mainContent = fs.readFileSync(mainPath, 'utf-8');
  if (mainContent.includes('loadDynamicResume') && mainContent.includes('window.URL.createObjectURL')) {
    console.log('SUCCESS: loadDynamicResume is successfully hooked into main.js boot loader!');
  } else {
    console.error('FAIL: loadDynamicResume is missing from main.js.');
    process.exit(1);
  }
}

runTest();
