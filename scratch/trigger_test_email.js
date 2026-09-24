// scratch/trigger_test_email.js
import https from 'https';

console.log('Dispatching Testimonial Confirmation Email to mailfrlearntch@gmail.com...\n');

const payload = JSON.stringify({
  record: {
    id: 'test-testimonial-' + Date.now(),
    google_name: 'Jarvis',
    google_email: 'mailfrlearntch@gmail.com',
    google_avatar: null,
    linkedin_url: 'https://linkedin.com/in/jarvis',
    designation: 'AI Architect',
    company: 'Stark Industries',
    rating: 5,
    testimonial: 'Ashok is an exceptional engineer with a sharp eye for modern UI aesthetics and deep system architecture.',
    consent_public: true,
    status: 'pending',
    created_at: new Date().toISOString()
  }
});

const projectRef = 'xpuhbtsgwhgbcvmwzlyd';
const secret = 'db_webhook_secret_99882244';

const options = {
  hostname: `${projectRef}.supabase.co`,
  path: '/functions/v1/send-testimonial-email',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Webhook-Secret': secret,
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
    try {
      const json = JSON.parse(responseData);
      if (json.success) {
        console.log('\n🎉 SUCCESS! Testimonial confirmation email has been dispatched to mailfrlearntch@gmail.com!');
      } else {
        console.error('\n⚠️ Response returned error:', json);
      }
    } catch (e) {
      console.log('Raw output:', responseData);
    }
  });
});

req.on('error', (e) => {
  console.error('Network error connecting to Edge Function:', e.message);
});

req.write(payload);
req.end();
