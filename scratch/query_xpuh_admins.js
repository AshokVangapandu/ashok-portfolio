const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://xpuhbtsgwhgbcvmwzlyd.supabase.co";
const supabaseKey = "sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z";
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching admins:', error);
    } else {
      console.log('Admins in DB (latest first):', data);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

run();
