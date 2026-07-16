const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://txoszrnjkrlbjzpjisvp.supabase.co";
const supabaseKey = "sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdmins() {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*');
    
    if (error) {
      console.error('Error fetching admins:', error);
    } else {
      console.log('Admins in DB:', data);
    }
  } catch (err) {
    console.error('Catch error:', err);
  }
}

checkAdmins();
