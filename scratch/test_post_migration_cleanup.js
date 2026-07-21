// Post-Brevo Migration Cleanup Audit Script
const fs = require('fs');
const path = require('path');

console.log('Running Post-Brevo Migration Email Infrastructure Cleanup Audit...\n');

const functionsDir = path.join(__dirname, '..', 'supabase', 'functions');
const emailProviderPath = path.join(functionsDir, '_shared', 'emailProvider.ts');
const contactPath = path.join(functionsDir, 'send-contact-email', 'index.ts');
const testimonialPath = path.join(functionsDir, 'send-testimonial-email', 'index.ts');
const maintenancePath = path.join(functionsDir, 'send-maintenance-notification', 'index.ts');
const workflowServicePath = path.join(__dirname, '..', 'src', 'services', 'notificationWorkflowService.ts');

let allPassed = true;

function assert(condition, description) {
  if (condition) {
    console.log(`✓ ${description}`);
  } else {
    console.error(`✗ ${description}`);
    allPassed = false;
  }
}

// 1. Check emailProvider.ts defaults
const providerContent = fs.readFileSync(emailProviderPath, 'utf8');
assert(providerContent.includes("'noreply@ashokvangapandu.com'"), "emailProvider.ts default email is 'noreply@ashokvangapandu.com'");
assert(providerContent.includes("'Ashok Portfolio'"), "emailProvider.ts default name is 'Ashok Portfolio'");
assert(!providerContent.includes("ashokvangapandu45@gmail.com"), "emailProvider.ts zero references to legacy gmail default");

// 2. Check Edge Functions for legacy resend.dev or gmail defaults
const edgeFiles = [
  { name: 'send-contact-email', path: contactPath },
  { name: 'send-testimonial-email', path: testimonialPath },
  { name: 'send-maintenance-notification', path: maintenancePath }
];

edgeFiles.forEach(ef => {
  const content = fs.readFileSync(ef.path, 'utf8');
  assert(!content.includes('resend.dev'), `${ef.name}: zero references to resend.dev`);
  assert(!content.includes('ashokvangapandu45@gmail.com'), `${ef.name}: zero references to legacy gmail default`);
  assert(content.includes('sendEmail'), `${ef.name}: routes through emailProvider sendEmail()`);
});

// 3. Check notificationWorkflowService.ts
const workflowContent = fs.readFileSync(workflowServicePath, 'utf8');
assert(workflowContent.includes("'noreply@ashokvangapandu.com'"), "notificationWorkflowService.ts fallback sender email is 'noreply@ashokvangapandu.com'");
assert(workflowContent.includes("'Ashok Portfolio'"), "notificationWorkflowService.ts fallback sender name is 'Ashok Portfolio'");
assert(!workflowContent.includes("ashokvangapandu45@gmail.com"), "notificationWorkflowService.ts zero references to legacy gmail default");

console.log('\n====================================================');
if (allPassed) {
  console.log('SUCCESS: Post-Migration Email Infrastructure Cleanup Audit Passed 100%!');
} else {
  console.error('FAILURE: Cleanup audit found legacy residue.');
  process.exit(1);
}
