const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const envVars = {};
for (const line of env.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const idx = trimmed.indexOf('=');
    envVars[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
  }
}
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('testimonials').select('*').limit(2);
  console.log('Columns:', data && data[0] ? Object.keys(data[0]) : error);
  console.log('Data:', JSON.stringify(data, null, 2));
}

check();
