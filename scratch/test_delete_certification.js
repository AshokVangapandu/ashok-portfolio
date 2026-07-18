// scratch/test_delete_certification.js
const url = 'https://txoszrnjkrlbjzpjisvp.supabase.co';
const anonKey = 'sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB';

async function runTests() {
  console.log('--- Phase 6 Certifications Delete DB Test ---');

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

  // Step 2: Insert Certification to Delete
  console.log('\nInserting certification to delete...');
  const insertPayload = {
    title: 'Temporary Certification to Delete',
    issuer: 'Test Issuer',
    category: 'Testing',
    description: 'This record will be deleted during tests.',
    issue_date: 'Feb 2026',
    status: 'draft',
    is_featured: false,
    display_order: 0,
    certificate_image_url: `${url}/storage/v1/object/public/certifications/icons/temp-image.png`,
    certificate_file_url: `${url}/storage/v1/object/public/certifications/media/temp-file.pdf`
  };

  const insertRes = await fetch(`${url}/rest/v1/certifications`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(insertPayload)
  });

  if (!insertRes.ok) {
    console.error('Insert failed:', await insertRes.text());
    process.exit(1);
  }

  const insertData = await insertRes.json();
  const certId = insertData[0].id;
  console.log('Certification created with ID:', certId);

  // Step 3: Delete Certification
  console.log('\nDeleting certification...');
  const deleteRes = await fetch(`${url}/rest/v1/certifications?id=eq.${certId}`, {
    method: 'DELETE',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`
    }
  });

  if (!deleteRes.ok) {
    console.error('Delete failed:', await deleteRes.text());
    process.exit(1);
  }
  console.log('Delete query executed successfully.');

  // Step 4: Verify record is completely gone
  console.log('\nVerifying record is removed from database...');
  const verifyRes = await fetch(`${url}/rest/v1/certifications?id=eq.${certId}`, {
    method: 'GET',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`
    }
  });

  const verifyData = await verifyRes.json();
  console.log('Records remaining with ID:', verifyData.length);
  if (verifyData.length === 0) {
    console.log('SUCCESS: Certification was deleted successfully from database!');
  } else {
    console.error('FAILURE: Certification still exists!');
    process.exit(1);
  }
}

runTests();
