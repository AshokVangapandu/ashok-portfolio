const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://xpuhbtsgwhgbcvmwzlyd.supabase.co";
const supabaseKey = "sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z";
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = "mailfrlearntch@gmail.com";
  const role = "Admin";
  console.log(`Invoking Edge Function send-admin-invitation for email: ${email}, role: ${role}`);
  
  try {
    const start = Date.now();
    const { data, error } = await supabase.functions.invoke('send-admin-invitation', {
      body: { email, role }
    });
    const duration = Date.now() - start;
    console.log(`Finished in ${duration}ms`);
    console.log('Result:', { data, error });
  } catch (err) {
    console.error('Exception occurred during invocation:', err);
  }
}

run();
