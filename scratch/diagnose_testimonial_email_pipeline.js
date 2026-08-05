const https = require('https');

console.log('Tracing send-testimonial-email Edge Function pipeline on Production...\n');

const payload = JSON.stringify({
  record: {
    id: 'test-testimonial-diagnostic-id',
    google_name: 'Diagnostic Test User',
    google_email: 'ashokvangapandu45@gmail.com',
    google_avatar: null,
    linkedin_url: null,
    designation: 'Staff Diagnostic Tester',
    company: 'Diagnostic Corp',
    rating: 5,
    testimonial: 'Testing testimonial submission edge function pipeline end-to-end.',
    consent_public: true,
    status: 'pending',
    created_at: new Date().toISOString()
  }
});

const options = {
  hostname: 'txoszrnjkrlbjzpjisvp.supabase.co',
  path: '/functions/v1/send-testimonial-email',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Webhook-Secret': 'db_webhook_secret_99882244',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(options, (res) => {
  console.log(`HTTP Status Code: ${res.statusCode}`);
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response Body:', responseData);
    console.log('\n--- Diagnostic Stage Tracing Results ---');
    try {
      const json = JSON.parse(responseData);
      if (json.error && json.error.includes('Unauthorized')) {
        console.error('ROOT CAUSE IDENTIFIED: Webhook Secret Mismatch');
      } else if (json.error) {
        console.error(`ROOT CAUSE IDENTIFIED: Edge Function Error: ${json.error}`);
      } else {
        console.log('SUCCESS: Email webhook executed successfully!');
      }
    } catch (e) {
      console.log('Raw output:', responseData);
    }
  });
});

req.on('error', (e) => {
  console.error('Network Error connecting to Edge Function:', e.message);
});

req.write(payload);
req.end();
