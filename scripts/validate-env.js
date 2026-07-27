// scripts/validate-env.js
const fs = require('fs');
const path = require('path');

// Load .env variables manually to support local builds where they aren't pre-loaded on process.env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const matched = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (matched) {
      const key = matched[1];
      let value = matched[2] || '';
      // Remove surrounding quotes if any
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.substring(1, value.length - 1);
      }
      if (!process.env[key]) {
        process.env[key] = value.trim();
      }
    }
  });
}

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

let hasErrors = false;
console.log('Validating Supabase Environment Configuration...\n');

// 1. Validate VITE_SUPABASE_URL
if (!url) {
  console.error('❌ Missing VITE_SUPABASE_URL');
  console.error('Expected:\nhttps://<project>.supabase.co');
  console.error('Received:\nundefined\n');
  hasErrors = true;
} else {
  const isPlaceholder = url.startsWith('%VITE_') || url.includes('%');
  const startsWithHttps = url.startsWith('https://');
  const matchesFormat = /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co\/?$/.test(url);

  if (isPlaceholder || !startsWithHttps || !matchesFormat) {
    console.error('❌ Invalid VITE_SUPABASE_URL');
    console.error('Expected:\nhttps://<project>.supabase.co');
    console.error(`Received:\n${url}\n`);
    hasErrors = true;
  } else {
    console.log('✓ VITE_SUPABASE_URL detected');
    console.log('✓ Valid HTTPS URL');
  }
}

// 2. Validate VITE_SUPABASE_ANON_KEY
if (!key) {
  console.error('❌ Missing VITE_SUPABASE_ANON_KEY');
  console.error('Expected:\nsb_publishable_<key>');
  console.error('Received:\nundefined\n');
  hasErrors = true;
} else {
  const isPlaceholder = key.startsWith('%VITE_') || key.includes('%');
  const startsWithPrefix = key.startsWith('sb_publishable_');

  if (isPlaceholder || !startsWithPrefix) {
    console.error('❌ Invalid VITE_SUPABASE_ANON_KEY');
    console.error('Expected:\nsb_publishable_<key>');
    // Print only the safe slice to avoid leaking the secret if it's incorrect but contains sensitive info
    console.error(`Received:\n${key.substring(0, 15)}...\n`);
    hasErrors = true;
  } else {
    console.log('✓ VITE_SUPABASE_ANON_KEY detected');
    console.log('✓ Environment validation passed\n');
  }
}

if (hasErrors) {
  console.error('Build aborted: Environment validation failed.\n');
  process.exit(1);
} else {
  console.log('Starting production build...\n');
  process.exit(0);
}
