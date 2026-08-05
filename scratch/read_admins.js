const { createClient } = require('@supabase/supabase-js');

const prodDb = {
  url: "https://txoszrnjkrlbjzpjisvp.supabase.co",
  key: "sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB"
};

async function run() {
  const supabase = createClient(prodDb.url, prodDb.key);
  
  const { data, error } = await supabase.from('admins').select('*');
  if (error) {
    console.error('Error fetching admins:', error.message);
  } else {
    console.log('Production Admins list:', data);
  }
}

run();
