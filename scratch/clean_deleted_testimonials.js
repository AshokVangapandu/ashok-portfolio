import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xpuhbtsgwhgbcvmwzlyd.supabase.co';
const supabaseKey = 'sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z';

const supabase = createClient(supabaseUrl, supabaseKey);

async function clean() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('id, full_name, email, deleted_at')
    .not('deleted_at', 'is', null);

  console.log('Soft-deleted records in Supabase:', data);
  if (data && data.length > 0) {
    for (const record of data) {
      console.log(`Permanently deleting id: ${record.id} (${record.full_name})...`);
      const { error: delErr } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', record.id);
      if (delErr) {
        console.error(`Failed to delete ${record.id}:`, delErr);
      } else {
        console.log(`✓ Permanently deleted ${record.id}`);
      }
    }
  }
}

clean();
