// Diagnostic script to trace send-contact-email pipeline
const https = require('https');

console.log('Tracing send-contact-email Edge Function pipeline...\n');

const payload = JSON.stringify({
  record: {
    id: 'test-diagnostic-id',
    full_name: 'Diagnostic Test User',
    email: 'ashokvangapandu45@gmail.com',
    subject: 'Diagnostic Pipeline Test',
    message: 'Testing Brevo migration pipeline end-to-end.',
    created_at: new Date().toISOString()
  }
});

const options = {
  hostname: 'txoszrnjkrlbjzpjisvp.supabase.co',
  path: '/functions/v1/send-contact-email',
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
      if (json.error && json.error.includes('BREVO_API_KEY missing')) {
        console.error('ROOT CAUSE IDENTIFIED: BREVO_API_KEY secret is NOT set on Supabase Cloud!');
      } else if (json.error && json.error.includes('Unauthorized')) {
        console.error('ROOT CAUSE IDENTIFIED: Webhook Secret Mismatch');
      } else if (json.error) {
        console.error(`ROOT CAUSE IDENTIFIED: ${json.error}`);
      } else if (json.success) {
        console.log('SUCCESS: Email sent successfully! Message ID:', json.id);
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
