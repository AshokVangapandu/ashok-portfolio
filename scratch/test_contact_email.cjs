const fs = require('fs');
const path = require('path');

const env = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
const envVars = {};
for (const line of env.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const idx = trimmed.indexOf('=');
    envVars[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
  }
}

async function testContactEmail() {
  const url = 'https://xpuhbtsgwhgbcvmwzlyd.supabase.co/functions/v1/send-contact-email';
  const payload = {
    record: {
      id: 'test-contact-123',
      full_name: 'Jarvis',
      email: 'mailfrlearntch@gmail.com',
      subject: 'Collaboration on New Project',
      message: 'Hi Ashok, I saw your portfolio and would love to collaborate on a modern full-stack web project.',
      created_at: new Date().toISOString()
    }
  };

  console.log('Sending test contact message to edge function:', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': 'db_webhook_secret_99882244'
      },
      body: JSON.stringify(payload)
    });

    const status = res.status;
    const body = await res.json();
    console.log('Response status:', status);
    console.log('Response body:', JSON.stringify(body, null, 2));
  } catch (err) {
    console.error('Test error:', err);
  }
}

testContactEmail();
