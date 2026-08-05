const { createClient } = require('@supabase/supabase-js');

const prodDb = {
  url: "https://txoszrnjkrlbjzpjisvp.supabase.co",
  key: "sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB"
};

const tables = [
  'contact_messages',
  'testimonials',
  'admins',
  'certifications',
  'resume_settings',
  'resume_downloads',
  'portfolio_settings',
  'social_links',
  'maintenance_subscribers',
  'authorized_users',
  'access_requests',
  'projects',
  'tools_products',
  'project_features',
  'feature_bullets',
  'project_gallery',
  'visitor_profiles',
  'visitor_sessions',
  'page_views',
  'analytics_events'
];

async function run() {
  console.log(`Checking table existence in Production (${prodDb.url}):`);
  const supabase = createClient(prodDb.url, prodDb.key);
  
  for (const table of tables) {
    const selectCol = table === 'visitor_profiles' ? 'visitor_id' : 'id';
    const { error } = await supabase.from(table).select(selectCol).limit(1);
    
    if (error) {
      if (error.code === 'PGRST205') {
        console.log(`❌ Table ${table}: MISSING`);
      } else {
        // Table exists, but query failed due to other reasons (e.g. column name mismatch, RLS restriction, etc.)
        console.log(`✅ Table ${table}: EXISTS (Query result: ${error.message} [code: ${error.code}])`);
      }
    } else {
      console.log(`✅ Table ${table}: EXISTS`);
    }
  }
}

run();
