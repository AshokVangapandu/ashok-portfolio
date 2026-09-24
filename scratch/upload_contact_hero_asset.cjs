const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Copy source image to public & dist
const sourceImage = 'C:\\Users\\VangapanduAshokNagaV\\.gemini\\antigravity-ide\\brain\\20079422-4852-4990-977f-d18eb5f5a675\\.user_uploaded\\media_1789993266522.png';
const publicDir = path.join(__dirname, '..', 'public', 'email-assets');
const distDir = path.join(__dirname, '..', 'dist', 'email-assets');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

fs.copyFileSync(sourceImage, path.join(publicDir, 'contact-message-received.png'));
fs.copyFileSync(sourceImage, path.join(distDir, 'contact-message-received.png'));
console.log('Copied to public and dist email-assets/contact-message-received.png');

// 2. Upload to Supabase Storage
const env = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
const envVars = {};
for (const line of env.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const idx = trimmed.indexOf('=');
    envVars[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
  }
}

const fileBuffer = fs.readFileSync(sourceImage);

const projectConfigs = [
  {
    name: 'Primary (xpuhbtsgwhgbcvmwzlyd)',
    url: envVars.VITE_SUPABASE_URL || 'https://xpuhbtsgwhgbcvmwzlyd.supabase.co',
    key: envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.VITE_SUPABASE_ANON_KEY
  }
];

// Check for legacy project url if available
const legacyUrl = 'https://txoszrnjkrlbjzpjisvp.supabase.co';
if (envVars.SUPABASE_SERVICE_ROLE_KEY_TX) {
  projectConfigs.push({
    name: 'Legacy (txoszrnjkrlbjzpjisvp)',
    url: legacyUrl,
    key: envVars.SUPABASE_SERVICE_ROLE_KEY_TX
  });
}

async function uploadAsset() {
  for (const cfg of projectConfigs) {
    try {
      const supabase = createClient(cfg.url, cfg.key);
      const { data, error } = await supabase.storage
        .from('email-assets')
        .upload('contact-message-received.png', fileBuffer, {
          contentType: 'image/png',
          upsert: true
        });
      if (error) {
        console.error(`Upload error on ${cfg.name}:`, error);
      } else {
        console.log(`Upload SUCCESS on ${cfg.name}:`, data);
      }
    } catch (e) {
      console.error(`Upload exception on ${cfg.name}:`, e);
    }
  }
}

uploadAsset();
