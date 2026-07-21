// Pre-Phase 4 Configuration Validation Script
const fs = require('fs');
const path = require('path');

console.log('Running Pre-Phase 4 Configuration Validation Audit...\n');

const functionsDir = path.join(__dirname, '..', 'supabase', 'functions');
const sharedProviderPath = path.join(functionsDir, '_shared', 'emailProvider.ts');
const contactPath = path.join(functionsDir, 'send-contact-email', 'index.ts');
const testimonialPath = path.join(functionsDir, 'send-testimonial-email', 'index.ts');
const maintenancePath = path.join(functionsDir, 'send-maintenance-notification', 'index.ts');

let allPassed = true;

// 1. Shared emailProvider.ts checks
if (!fs.existsSync(sharedProviderPath)) {
  console.error('✗ Missing _shared/emailProvider.ts');
  allPassed = false;
} else {
  const providerContent = fs.readFileSync(sharedProviderPath, 'utf8');
  
  const checks = [
    { name: 'BREVO_API_KEY env read', str: "Deno.env.get('BREVO_API_KEY')" },
    { name: 'BREVO_SENDER_NAME env read', str: "Deno.env.get('BREVO_SENDER_NAME')" },
    { name: 'BREVO_SENDER_EMAIL env read', str: "Deno.env.get('BREVO_SENDER_EMAIL')" },
    { name: 'Brevo API v3 URL', str: 'https://api.brevo.com/v3/smtp/email' },
    { name: 'Brevo api-key header', str: "'api-key': this.apiKey" }
  ];

  checks.forEach(c => {
    if (providerContent.includes(c.str)) {
      console.log(`✓ emailProvider.ts: ${c.name}`);
    } else {
      console.error(`✗ emailProvider.ts: Missing ${c.name}`);
      allPassed = false;
    }
  });
}

// 2. Edge Function checks
const edgeFiles = [
  { name: 'send-contact-email', path: contactPath },
  { name: 'send-testimonial-email', path: testimonialPath },
  { name: 'send-maintenance-notification', path: maintenancePath }
];

edgeFiles.forEach(ef => {
  if (!fs.existsSync(ef.path)) {
    console.error(`✗ Missing ${ef.name}`);
    allPassed = false;
    return;
  }
  const content = fs.readFileSync(ef.path, 'utf8');

  if (content.includes('RESEND_API_KEY')) {
    console.error(`✗ ${ef.name}: Still references RESEND_API_KEY`);
    allPassed = false;
  } else {
    console.log(`✓ ${ef.name}: No RESEND_API_KEY references`);
  }

  if (content.includes('Access-Control-Allow-Origin') && content.includes("req.method === 'OPTIONS'")) {
    console.log(`✓ ${ef.name}: CORS & OPTIONS preflight configured`);
  } else {
    console.error(`✗ ${ef.name}: Missing CORS configuration`);
    allPassed = false;
  }

  if (content.includes('sendEmail')) {
    console.log(`✓ ${ef.name}: Dispatches via shared sendEmail()`);
  } else {
    console.error(`✗ ${ef.name}: Missing sendEmail invocation`);
    allPassed = false;
  }
});

// 3. Frontend Secret Leak Checks
const frontendFiles = ['src/main.tsx', 'src/App.tsx', 'js/main.js'];
frontendFiles.forEach(ff => {
  const p = path.join(__dirname, '..', ff);
  if (fs.existsSync(p)) {
    const c = fs.readFileSync(p, 'utf8');
    if (c.includes('BREVO_API_KEY')) {
      console.error(`✗ Secret leakage in ${ff}`);
      allPassed = false;
    }
  }
});

if (allPassed) {
  console.log('\nSUCCESS: Configuration Validation Audit Passed 100%! System ready for deployment & E2E testing.');
} else {
  console.error('\nFAILURE: Configuration Validation Audit Failed.');
  process.exit(1);
}
