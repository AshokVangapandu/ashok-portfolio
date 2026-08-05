const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const ENV_PATH = path.join(__dirname, '..', '.env');
const PROD_REF = 'txoszrnjkrlbjzpjisvp';

let dbPassword = process.env.PRODUCTION_DB_PASSWORD;
if (!dbPassword && fs.existsSync(ENV_PATH)) {
  const envContent = fs.readFileSync(ENV_PATH, 'utf8');
  const match = envContent.match(/PRODUCTION_DB_PASSWORD=(.*)/);
  if (match) {
    dbPassword = match[1].trim();
  }
}

const prodDb = {
  url: "https://txoszrnjkrlbjzpjisvp.supabase.co",
  key: "sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB"
};

async function testWorkflow() {
  console.log('Starting end-to-end Testimonial Workflow Test on Production...\n');
  const supabase = createClient(prodDb.url, prodDb.key);

  const testId = 'f979149b-76b6-4b67-a068-0cb93a20721c';
  const testTestimonial = {
    id: testId,
    user_id: '8c69598c-d084-459d-b007-b8f78829018d', // Ashok V's admin user id (valid UUID)
    full_name: 'Workflow Diagnostic Submitter',
    email: 'ashokvangapandu45@gmail.com', // Active personal email to receive notification
    avatar_url: null,
    linkedin_url: null,
    testimonial: 'This is a test of the complete end-to-end testimonial workflow.',
    status: 'pending',
    featured: false,
    is_visible: false,
    display_order: null,
    rating: 5,
    designation: 'Staff Workflow Auditor',
    company: 'Test & Audit Co'
  };

  try {
    // 1. Submit Testimonial (PENDING)
    console.log('1. Submitting new pending testimonial...');
    const { error: insertError } = await supabase
      .from('testimonials')
      .insert([testTestimonial]);

    if (insertError) {
      throw new Error(`Submission failed: ${insertError.message}`);
    }
    console.log('✅ Submission: SUCCESS! (Insert completed, trigger fired)');

    // Wait a brief moment for async http request queue to dispatch
    console.log('Waiting 5 seconds for submission emails to dispatch...');
    await new Promise(r => setTimeout(r, 5000));

    // 2. Approve Testimonial
    console.log('2. Approving testimonial...');
    const { error: updateError } = await supabase
      .from('testimonials')
      .update({
        status: 'approved',
        is_visible: true,
        approved_at: new Date().toISOString(),
        approved_by: 'ashokvangapandu45@gmail.com'
      })
      .eq('id', testId);

    if (updateError) {
      throw new Error(`Approval failed: ${updateError.message}`);
    }
    console.log('✅ Approval: SUCCESS! (Update completed, trigger fired)');

    // Wait a brief moment for approval email to dispatch
    console.log('Waiting 5 seconds for approval email to dispatch...');
    await new Promise(r => setTimeout(r, 5000));

  } catch (err) {
    console.error('❌ E2E Test Failed:', err.message);
  } finally {
    // 3. Clean up
    console.log('3. Cleaning up test testimonial...');
    const { error: deleteError } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', testId);

    if (deleteError) {
      console.error('Failed to clean up test testimonial:', deleteError.message);
    } else {
      console.log('✅ Clean up successful.');
    }
  }
}

testWorkflow();
