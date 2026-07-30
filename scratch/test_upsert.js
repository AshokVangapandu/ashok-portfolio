// scratch/test_upsert.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env
const envPath = path.join(__dirname, '../.env');
let supabaseUrl = '';
let supabaseAnonKey = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      // Remove surrounding quotes if present
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.substring(1, value.length - 1);
      }
      if (key === 'VITE_SUPABASE_URL') supabaseUrl = value;
      if (key === 'VITE_SUPABASE_ANON_KEY') supabaseAnonKey = value;
    }
  });
}

// Fallback defaults
supabaseUrl = supabaseUrl || 'https://xpuhbtsgwhgbcvmwzlyd.supabase.co';
supabaseAnonKey = supabaseAnonKey || 'sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey ? 'Exists' : 'Missing');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('Fetching social links...');
  const { data: selectData, error: selectError } = await supabase
    .from('social_links')
    .select('*');
  
  console.log('Select Result:', { data: selectData, error: selectError });

  console.log('Attempting upsert...');
  const payload = [
    { platform: 'linkedin', url: 'https://linkedin.com/in/ashok-test', display_order: 1 },
    { platform: 'github', url: 'https://github.com/ashok-test', display_order: 2 }
  ];
  
  const { data: upsertData, error: upsertError } = await supabase
    .from('social_links')
    .upsert(payload, { onConflict: 'platform' });

  console.log('Upsert Result:', { data: upsertData, error: upsertError });
}

test();
