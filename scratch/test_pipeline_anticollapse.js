// scratch/test_pipeline_anticollapse.js

async function testSubmissionAndApproval() {
  const edgeFunctionUrl = 'https://xpuhbtsgwhgbcvmwzlyd.supabase.co/functions/v1/send-testimonial-email';
  
  // 1. Test Testimonial Submission (Pending)
  console.log('Testing Testimonial Received Confirmation email...');
  const subPayload = {
    record: {
      id: 'sub-' + Date.now(),
      google_name: 'Jarvis',
      google_email: 'mailfrlearntch@gmail.com',
      google_avatar: 'https://lh3.googleusercontent.com/a/default-user',
      linkedin_url: 'https://linkedin.com/in/jarvis',
      designation: 'AI Architect',
      company: 'Future Systems',
      rating: 5,
      testimonial: 'The portfolio is super clean and the email design is next-level!',
      is_visible: false,
      status: 'pending',
      created_at: new Date().toISOString()
    }
  };

  const res1 = await fetch(edgeFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-secret': 'db_webhook_secret_99882244'
    },
    body: JSON.stringify(subPayload)
  });
  const data1 = await res1.json();
  console.log('Submission Email Status:', res1.status, 'Body:', data1);

  // 2. Test Testimonial Approval (Approved)
  console.log('\nTesting Testimonial Approved & Live email...');
  const appPayload = {
    record: {
      id: 'app-' + Date.now(),
      google_name: 'Jarvis',
      google_email: 'mailfrlearntch@gmail.com',
      google_avatar: 'https://lh3.googleusercontent.com/a/default-user',
      linkedin_url: 'https://linkedin.com/in/jarvis',
      designation: 'AI Architect',
      company: 'Future Systems',
      rating: 5,
      testimonial: 'The portfolio is super clean and the email design is next-level!',
      is_visible: true,
      status: 'approved',
      created_at: new Date().toISOString()
    }
  };

  const res2 = await fetch(edgeFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-secret': 'db_webhook_secret_99882244'
    },
    body: JSON.stringify(appPayload)
  });
  const data2 = await res2.json();
  console.log('Approval Email Status:', res2.status, 'Body:', data2);
}

testSubmissionAndApproval();
