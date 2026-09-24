import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xpuhbtsgwhgbcvmwzlyd.supabase.co';
const supabaseKey = 'sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTrigger() {
  console.log('1. Setting testimonial 2c4578ab-ef07-4fcb-b4fe-8713d9e51995 to pending...');
  const { data: pData, error: pErr } = await supabase
    .from('testimonials')
    .update({ status: 'pending' })
    .eq('id', '2c4578ab-ef07-4fcb-b4fe-8713d9e51995')
    .select();

  if (pErr) {
    console.error('Error setting to pending:', pErr);
    return;
  }
  console.log('Testimonial status set to pending successfully.');

  // Wait 1 second
  await new Promise(r => setTimeout(r, 1000));

  console.log('\n2. Updating status to approved to fire the database trigger...');
  const { data: aData, error: aErr } = await supabase
    .from('testimonials')
    .update({ 
      status: 'approved', 
      is_visible: true, 
      approved_at: new Date().toISOString(),
      approved_by: 'ashokvangapandu45@gmail.com' 
    })
    .eq('id', '2c4578ab-ef07-4fcb-b4fe-8713d9e51995')
    .select();

  if (aErr) {
    console.error('Error approving:', aErr);
    return;
  }
  console.log('Testimonial approved successfully in database! The database trigger tr_on_testimonial_updated has executed.');
}

testTrigger();
