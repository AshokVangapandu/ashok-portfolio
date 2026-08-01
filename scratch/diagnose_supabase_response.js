const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://xpuhbtsgwhgbcvmwzlyd.supabase.co";
const supabaseKey = "sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z";

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const response = await supabase
    .from('resume_settings')
    .select('*')
    .eq('is_active', true)
    .maybeSingle();
  console.log("RAW SUPABASE RESPONSE:", JSON.stringify(response, null, 2));
}

check();
