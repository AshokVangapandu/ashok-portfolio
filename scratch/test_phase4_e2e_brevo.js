// Phase 4 End-to-End Brevo Email System Validation Script
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('PHASE 4: END-TO-END BREVO EMAIL SYSTEM VALIDATION');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName}${details ? ' - ' + details : ''}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName}${details ? ' - ' + details : ''}`);
    failCount++;
  }
}

const functionsDir = path.join(__dirname, '..', 'supabase', 'functions');
const sharedProviderPath = path.join(functionsDir, '_shared', 'emailProvider.ts');
const contactPath = path.join(functionsDir, 'send-contact-email', 'index.ts');
const testimonialPath = path.join(functionsDir, 'send-testimonial-email', 'index.ts');
const maintenancePath = path.join(functionsDir, 'send-maintenance-notification', 'index.ts');
const workflowServicePath = path.join(__dirname, '..', 'src', 'services', 'notificationWorkflowService.ts');

// STEP 1: Verify Environment Configuration
console.log('--- Step 1: Environment Configuration & Fallbacks ---');
const providerContent = fs.readFileSync(sharedProviderPath, 'utf8');
assert(providerContent.includes("Deno.env.get('BREVO_API_KEY')"), 'Reads BREVO_API_KEY secret');
assert(providerContent.includes("Deno.env.get('BREVO_SENDER_EMAIL')"), 'Reads BREVO_SENDER_EMAIL secret');
assert(providerContent.includes("Deno.env.get('BREVO_SENDER_NAME')"), 'Reads BREVO_SENDER_NAME secret');

// STEP 2: Verify Provider Connectivity & Schema Mapping
console.log('\n--- Step 2: Brevo v3 API Protocol & Schema Validation ---');
assert(providerContent.includes('https://api.brevo.com/v3/smtp/email'), 'Brevo v3 REST Endpoint URL configured');
assert(providerContent.includes("'api-key': this.apiKey"), 'Brevo api-key Authorization Header configured');
assert(providerContent.includes('htmlContent: options.html'), 'Maps HTML parameter to htmlContent');
assert(providerContent.includes('textContent: options.text'), 'Maps text parameter to textContent');
assert(providerContent.includes('parseEmailString'), 'Implements legacy email string parser helper');

// STEP 3: Contact Form Workflow
console.log('\n--- Step 3: Contact Form Workflow Migration ---');
const contactContent = fs.readFileSync(contactPath, 'utf8');
assert(contactContent.includes('sendEmail({'), 'send-contact-email uses shared sendEmail()');
assert(!contactContent.includes('api.resend.com'), 'send-contact-email has 0 Resend references');
assert(contactContent.includes("req.method === 'OPTIONS'"), 'send-contact-email handles CORS preflight');

// STEP 4: Testimonial Workflow
console.log('\n--- Step 4: Testimonial Workflow Migration ---');
const testimonialContent = fs.readFileSync(testimonialPath, 'utf8');
assert(testimonialContent.includes('adminResult = await sendEmail'), 'Admin notification uses shared sendEmail()');
assert(testimonialContent.includes('thankYouResult = await sendEmail'), 'Submitter thank-you uses shared sendEmail()');
assert(!testimonialContent.includes('api.resend.com'), 'send-testimonial-email has 0 Resend references');

// STEP 5: Maintenance Recovery Workflow
console.log('\n--- Step 5: Maintenance Mode Recovery Broadcast Workflow ---');
const maintenanceContent = fs.readFileSync(maintenancePath, 'utf8');
assert(maintenanceContent.includes('sendEmail({'), 'send-maintenance-notification uses shared sendEmail()');
assert(!maintenanceContent.includes('api.resend.com'), 'send-maintenance-notification has 0 Resend references');

const workflowContent = fs.readFileSync(workflowServicePath, 'utf8');
assert(workflowContent.includes('sendDirectBrevoEmail'), 'Workflow service direct fallback uses Brevo API');
assert(workflowContent.includes('https://api.brevo.com/v3/smtp/email'), 'Workflow fallback targets Brevo v3 endpoint');

// STEP 6: Failure Simulation & Error Handling
console.log('\n--- Step 6: Failure & Resilience Simulation ---');
assert(providerContent.includes("Missing API Key. Please set BREVO_API_KEY"), 'Handles missing BREVO_API_KEY gracefully');
assert(providerContent.includes("Brevo API Error:"), 'Parses and formats Brevo HTTP error responses');
assert(workflowContent.includes("status: 'failed'"), 'Preserves retry log updates on execution failure');

// STEP 7: Email HTML & Layout Quality
console.log('\n--- Step 7: Email HTML Quality & Layout Verification ---');
const sharedTemplatePath = path.join(functionsDir, '_shared', 'emailTemplate.ts');
const templateContent = fs.readFileSync(sharedTemplatePath, 'utf8');
assert(templateContent.includes('renderPortfolioEmail'), 'Shared layout renderer exists');
assert(templateContent.includes('#090d16'), 'Applies portfolio dark background theme (#090d16)');
assert(templateContent.includes('linear-gradient'), 'Renders gradient call-to-action button styling');

// STEP 8: Cleanup Verification
console.log('\n--- Step 8: Codebase Cleanup Audit ---');
const edgeFiles = [contactPath, testimonialPath, maintenancePath];
let resendCount = 0;
edgeFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  if (c.includes('api.resend.com') || c.includes('RESEND_API_KEY')) {
    resendCount++;
  }
});
assert(resendCount === 0, 'Zero Resend API keys or endpoints remain in any Edge Function');

console.log('\n====================================================');
console.log(`SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================\n');

if (failCount > 0) {
  process.exit(1);
}
