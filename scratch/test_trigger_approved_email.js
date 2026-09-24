// scratch/test_trigger_approved_email.js

async function testApprovedEmail() {
  const edgeFunctionUrl = 'https://xpuhbtsgwhgbcvmwzlyd.supabase.co/functions/v1/send-testimonial-email';
  
  const payload = {
    record: {
      id: 'test-approval-' + Date.now(),
      google_name: 'Alex Johnson',
      google_email: 'mailfrlearntch@gmail.com',
      google_avatar: 'https://lh3.googleusercontent.com/a/default-user',
      linkedin_url: 'https://linkedin.com/in/alexjohnson',
      designation: 'Senior Frontend Engineer',
      company: 'Tech Innovations Inc',
      rating: 5,
      testimonial: 'Working with Ashok was an absolute game changer! His attention to detail, UI craft, and technical depth are unmatched.',
      is_visible: true,
      status: 'approved',
      created_at: new Date().toISOString()
    }
  };

  console.log('Sending test approved email request...');
  const res = await fetch(edgeFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-secret': 'db_webhook_secret_99882244'
    },
    body: JSON.stringify(payload)
  });

  const body = await res.json();
  console.log('Status:', res.status);
  console.log('Response body:', JSON.stringify(body, null, 2));
}

testApprovedEmail();
