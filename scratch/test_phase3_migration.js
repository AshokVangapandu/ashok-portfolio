// Scratch verification script for Phase 3 Edge Function Migration to Shared emailProvider.ts
const fs = require('fs');
const path = require('path');

console.log('Running Phase 3 Edge Function Migration Audit...\n');

const functionsDir = path.join(__dirname, '..', 'supabase', 'functions');
const contactFile = path.join(functionsDir, 'send-contact-email', 'index.ts');
const testimonialFile = path.join(functionsDir, 'send-testimonial-email', 'index.ts');
const maintenanceFile = path.join(functionsDir, 'send-maintenance-notification', 'index.ts');

const edgeFiles = [
  { name: 'send-contact-email', path: contactFile },
  { name: 'send-testimonial-email', path: testimonialFile },
  { name: 'send-maintenance-notification', path: maintenanceFile }
];

let allPassed = true;

edgeFiles.forEach((file) => {
  if (!fs.existsSync(file.path)) {
    console.error(`✗ Missing file: ${file.name}`);
    allPassed = false;
    return;
  }

  const content = fs.readFileSync(file.path, 'utf8');

  // Check 1: No api.resend.com
  if (content.includes('api.resend.com')) {
    console.error(`✗ ${file.name}: STILL CONTAINS "api.resend.com"`);
    allPassed = false;
  } else {
    console.log(`✓ ${file.name}: Zero references to api.resend.com`);
  }

  // Check 2: No RESEND_API_KEY
  if (content.includes('RESEND_API_KEY')) {
    console.error(`✗ ${file.name}: STILL CONTAINS "RESEND_API_KEY"`);
    allPassed = false;
  } else {
    console.log(`✓ ${file.name}: Zero references to RESEND_API_KEY`);
  }

  // Check 3: Imports sendEmail
  if (content.includes('import { sendEmail } from "../_shared/emailProvider.ts"') || content.includes('sendEmail(')) {
    console.log(`✓ ${file.name}: Consumes shared emailProvider sendEmail()`);
  } else {
    console.error(`✗ ${file.name}: Missing sendEmail import or call`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\nSUCCESS: All Edge Functions successfully migrated to shared emailProvider.ts with 0 Resend references!');
} else {
  console.error('\nFAILURE: Resend references still remain in Edge Functions.');
  process.exit(1);
}
