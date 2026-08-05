const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse env
const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  try {
    const { data, count, error } = await supabase
      .from('visitor_sessions')
      .select('*, visitor_profiles(full_name, email, avatar_url), page_views(page_path, page_title)', { count: 'exact' });

    console.log('Query Error:', error);
    console.log('Query Count:', count);
    console.log('Sample data length:', data ? data.length : 0);
    if (data && data.length > 0) {
      console.log('First record page_views:', data[0].page_views);
      console.log('First record visitor_profiles:', data[0].visitor_profiles);
    }
  } catch (e) {
    console.error(e);
  }
}
test();
