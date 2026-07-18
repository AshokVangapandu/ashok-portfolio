// scratch/test_update_certification.js
const url = 'https://txoszrnjkrlbjzpjisvp.supabase.co';
const anonKey = 'sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB';

async function runTests() {
  console.log('--- Phase 5 Certifications Update DB Test ---');

  // Step 1: Login
  console.log('Logging in as ashokvangapandu45@gmail.com...');
  const loginRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'ashokvangapandu45@gmail.com',
      password: 'AdminPassword123!'
    })
  });

  if (!loginRes.ok) {
    console.error('Login failed:', await loginRes.text());
    process.exit(1);
  }

  const loginData = await loginRes.json();
  const token = loginData.access_token;
  console.log('Authenticated successfully!');

  // Step 2: Insert Draft Certification
  console.log('\nInserting initial draft certification...');
  const initialPayload = {
    title: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    category: 'Cloud',
    description: 'Initial description.',
    issue_date: 'Jan 2026',
    status: 'draft',
    is_featured: false,
    display_order: 0
  };

  const insertRes = await fetch(`${url}/rest/v1/certifications`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(initialPayload)
  });

  if (!insertRes.ok) {
    console.error('Insert failed:', await insertRes.text());
    process.exit(1);
  }

  const insertData = await insertRes.json();
  const certId = insertData[0].id;
  console.log('Draft certification created with ID:', certId);

  // Step 3: Update Certification
  console.log('\nUpdating certification details...');
  const updatePayload = {
    title: 'AWS Certified Cloud Practitioner',
    description: 'Updated description.',
    status: 'published',
    is_featured: true
  };

  const updateRes = await fetch(`${url}/rest/v1/certifications?id=eq.${certId}`, {
    method: 'PATCH',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(updatePayload)
  });

  if (!updateRes.ok) {
    console.error('Update failed:', await updateRes.text());
    process.exit(1);
  }

  const updateData = await updateRes.json();
  console.log('Update success! Updated record details:');
  console.log('- ID:', updateData[0].id, '(must match original ID)');
  console.log('- Title:', updateData[0].title);
  console.log('- Description:', updateData[0].description);
  console.log('- Status:', updateData[0].status);
  console.log('- Featured:', updateData[0].is_featured);

  // Step 4: Verify count does not duplicate
  console.log('\nVerifying no duplicates exist...');
  const checkRes = await fetch(`${url}/rest/v1/certifications?id=eq.${certId}`, {
    method: 'GET',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`
    }
  });

  const checkData = await checkRes.json();
  console.log('Records matching ID in database:', checkData.length);

  // Step 5: Cleanup
  console.log('\nCleaning up test records...');
  const deleteRes = await fetch(`${url}/rest/v1/certifications?id=eq.${certId}`, {
    method: 'DELETE',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`
    }
  });

  if (deleteRes.ok) {
    console.log('Cleanup completed successfully!');
  } else {
    console.error('Cleanup failed:', await deleteRes.text());
  }
}

runTests();
