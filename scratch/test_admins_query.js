const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://txoszrnjkrlbjzpjisvp.supabase.co";
const supabaseKey = "sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminsQuery() {
  const { data, error } = await supabase
    .from('admins')
    .select('email, role, is_active')
    .eq('email', 'ashokvangapandu45@gmail.com')
    .maybeSingle();

  console.log('Query result:', { data, error });
}

testAdminsQuery();
