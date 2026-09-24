import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xpuhbtsgwhgbcvmwzlyd.supabase.co';
const supabaseKey = 'sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  // Let's test calling send-testimonial-email directly with the exact payload from database
  const res = await fetch('https://xpuhbtsgwhgbcvmwzlyd.supabase.co/functions/v1/send-testimonial-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Secret': 'db_webhook_secret_99882244'
    },
    body: JSON.stringify({
      record: {
        id: '2c4578ab-ef07-4fcb-b4fe-8713d9e51995',
        google_name: 'Jarvis',
        google_email: 'mailfrlearntch@gmail.com',
        google_avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKh5OR4QzH2INhgZkzjWMFk3S7QrL2lyOJjVJGQxmIS4IlNiA=s96-c',
        linkedin_url: null,
        designation: 'Sr Software Engineer',
        company: 'Sattava',
        rating: 4,
        testimonial: 'Lorem Ipsum Dollor Ami Lorem Ipsum...',
        consent_public: true,
        status: 'approved',
        created_at: new Date().toISOString()
      }
    })
  });

  const json = await res.json();
  console.log('send-testimonial-email response:', json);
}

check();
