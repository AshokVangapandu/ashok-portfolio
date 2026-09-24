import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xpuhbtsgwhgbcvmwzlyd.supabase.co';
const supabaseKey = 'sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  // Let's check recent testimonials
  const { data: testimonials, error: tErr } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  console.log('Recent testimonials:', testimonials);
}

inspect();
