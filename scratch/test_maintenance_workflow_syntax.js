// Scratch script to verify notification workflow imports and structure
console.log('Testing notification workflow files...');

const fs = require('fs');
const path = require('path');

const filesToCheck = [
  'supabase/functions/_shared/emailTemplate.ts',
  'supabase/functions/send-maintenance-notification/index.ts',
  'supabase/functions/send-maintenance-notification/deno.json',
  'supabase/config.toml',
  'src/services/notificationWorkflowService.ts'
];

let allExist = true;
filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`✓ File exists: ${file} (${fs.statSync(fullPath).size} bytes)`);
  } else {
    console.error(`✗ Missing file: ${file}`);
    allExist = false;
  }
});

if (allExist) {
  console.log('All files verified successfully!');
} else {
  process.exit(1);
}
