// scratch/test_certifications.js
const url = 'https://txoszrnjkrlbjzpjisvp.supabase.co';
const anonKey = 'sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB';

async function runTests() {
  console.log('--- Phase 3 Certifications DB Test ---');

  // Step 1: Login to Supabase Auth as Admin
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
  console.log('\nInserting draft certification...');
  const draftPayload = {
    title: 'Test Draft Certification',
    issuer: 'Vite Academy',
    category: 'General',
    description: 'This is a draft certification.',
    issue_date: 'Jan 2026',
    status: 'draft',
    is_featured: false,
    display_order: 0
  };

  const draftRes = await fetch(`${url}/rest/v1/certifications`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(draftPayload)
  });

  if (!draftRes.ok) {
    console.error('Draft insert failed:', await draftRes.text());
  } else {
    const draftData = await draftRes.json();
    console.log('Draft insert success! ID:', draftData[0].id);
  }

  // Step 3: Insert Published Certification
  console.log('\nInserting published certification...');
  const pubPayload = {
    title: 'Test Published Certification',
    issuer: 'Vite Academy',
    category: 'General',
    description: 'This is a published certification.',
    issue_date: 'Feb 2026',
    status: 'published',
    is_featured: true,
    display_order: 1
  };

  const pubRes = await fetch(`${url}/rest/v1/certifications`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(pubPayload)
  });

  if (!pubRes.ok) {
    console.error('Published insert failed:', await pubRes.text());
  } else {
    const pubData = await pubRes.json();
    console.log('Published insert success! ID:', pubData[0].id);
  }

  // Step 4: Test Database Status Constraint (expecting failure)
  console.log('\nTesting status constraint (should fail)...');
  const invalidPayload = {
    title: 'Test Invalid Status Cert',
    issuer: 'Vite Academy',
    category: 'General',
    issue_date: 'Mar 2026',
    status: 'invalid_status'
  };

  const invalidRes = await fetch(`${url}/rest/v1/certifications`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(invalidPayload)
  });

  console.log('Constraint test status:', invalidRes.status, '(expected error status is 400)');
  if (!invalidRes.ok) {
    const errText = await invalidRes.text();
    console.log('Received expected DB error:', errText);
  }

  // Step 5: Query Certifications to verify they exist
  console.log('\nQuerying certifications list to verify database persistence...');
  const queryRes = await fetch(`${url}/rest/v1/certifications`, {
    method: 'GET',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`
    }
  });

  if (!queryRes.ok) {
    console.error('Query failed:', await queryRes.text());
  } else {
    const list = await queryRes.json();
    console.log(`Query success! Total certifications found: ${list.length}`);
    list.forEach(c => {
      console.log(`- [${c.status.toUpperCase()}] ${c.title} by ${c.issuer}`);
    });
  }

  // Step 6: Cleanup test data
  console.log('\nCleaning up test records from database...');
  const deleteRes = await fetch(`${url}/rest/v1/certifications?title=like.Test%25`, {
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
