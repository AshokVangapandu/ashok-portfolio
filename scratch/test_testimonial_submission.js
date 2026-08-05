const { createClient } = require('@supabase/supabase-js');

const devDb = {
  url: "https://xpuhbtsgwhgbcvmwzlyd.supabase.co",
  key: "sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z"
};

const prodDb = {
  url: "https://txoszrnjkrlbjzpjisvp.supabase.co",
  key: "sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB"
};

const testTestimonial = {
  user_id: '809312bd-d0df-4d1e-84b2-2973b1854817',
  full_name: 'Diagnostic Tester',
  email: 'tester@example.com',
  avatar_url: null,
  linkedin_url: null,
  testimonial: 'This is a diagnostic testimonial to trace the submission pipeline.',
  status: 'pending',
  featured: false,
  is_visible: false,
  display_order: null,
  rating: 5,
  designation: 'Staff Tester',
  company: 'Diagnostic Corp'
};

async function testSubmit(db, name) {
  console.log(`\n====================================================`);
  console.log(`Testing Testimonial Submission on: ${name} (${db.url})`);
  console.log(`====================================================`);
  
  const supabase = createClient(db.url, db.key);
  
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testTestimonial]);
      
    if (error) {
      console.error(`❌ Submission: FAILED`);
      console.error(`   Message: ${error.message}`);
      console.error(`   Code: ${error.code}`);
      console.error(`   Details: ${error.details}`);
      console.error(`   Hint: ${error.hint}`);
    } else {
      console.log(`✅ Submission: SUCCESS!`);
      console.log(`   Inserted Data:`, data);
      
      // Cleanup
      console.log(`Cleaning up inserted test testimonial...`);
      const { error: deleteErr } = await supabase
        .from('testimonials')
        .delete()
        .eq('user_id', testTestimonial.user_id);
        
      if (deleteErr) {
        console.error(`⚠️ Failed to clean up:`, deleteErr.message);
      } else {
        console.log(`✅ Clean up successful.`);
      }
    }
  } catch (err) {
    console.error(`💥 EXCEPTION:`, err.message);
  }
}

async function run() {
  await testSubmit(devDb, "DEV");
  await testSubmit(prodDb, "PROD");
}

run();
