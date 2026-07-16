const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://txoszrnjkrlbjzpjisvp.supabase.co";
const supabaseKey = "sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB";
const supabase = createClient(supabaseUrl, supabaseKey);

async function addAdmin() {
  try {
    const { data, error } = await supabase
      .from('admins')
      .insert([
        { email: 'ashokvangapandu45@gmail.com', role: 'admin', is_active: true }
      ])
      .select();
    
    if (error) {
      console.error('Error inserting admin:', error);
    } else {
      console.log('Success! Admin added:', data);
    }
  } catch (err) {
    console.error('Catch error:', err);
  }
}

addAdmin();
