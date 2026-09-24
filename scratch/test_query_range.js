const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://txoszrnjkrlbjzpjisvp.supabase.co', 'sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB');

async function test() {
  const query = supabase.from('resume_downloads').select('*');
  console.log('typeof query.range:', typeof query.range);
  console.log('typeof query.order:', typeof query.order);
}

test();
