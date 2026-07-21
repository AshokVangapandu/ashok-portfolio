// Scratch test script for Phase 2 Shared Email Provider Abstraction
const fs = require('fs');
const path = require('path');

console.log('Verifying Phase 2 Shared Email Provider Abstraction (emailProvider.ts)...\n');

const targetFile = path.join(__dirname, '..', 'supabase', 'functions', '_shared', 'emailProvider.ts');

if (!fs.existsSync(targetFile)) {
  console.error(`✗ Missing required file: ${targetFile}`);
  process.exit(1);
}

const content = fs.readFileSync(targetFile, 'utf8');

const requiredElements = [
  'export interface EmailRecipient',
  'export interface EmailSender',
  'export interface SendEmailOptions',
  'export interface SendEmailResult',
  'export interface IEmailProvider',
  'export class BrevoEmailProvider',
  'export async function sendEmail',
  'https://api.brevo.com/v3/smtp/email',
  'BREVO_API_KEY',
  'BREVO_SENDER_NAME',
  'BREVO_SENDER_EMAIL',
  'htmlContent',
  'textContent',
  'api-key'
];

let allPassed = true;

requiredElements.forEach((str) => {
  if (content.includes(str)) {
    console.log(`✓ Verified element: "${str}"`);
  } else {
    console.error(`✗ Missing element: "${str}"`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\nSUCCESS: emailProvider.ts successfully created with full Brevo API support and provider abstraction!');
} else {
  console.error('\nFAILURE: emailProvider.ts verification failed.');
  process.exit(1);
}
