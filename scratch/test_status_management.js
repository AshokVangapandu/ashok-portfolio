// scratch/test_status_management.js
const url = 'https://txoszrnjkrlbjzpjisvp.supabase.co';
const anonKey = 'sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB';

async function runTests() {
  console.log('--- Phase 7 Status & Featured Transitions DB Test ---');

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

  // Step 2: Create initial Draft, Unfeatured certification
  console.log('\nCreating initial Draft, Unfeatured record...');
  const insertPayload = {
    title: 'Mendix Certified Developer',
    issuer: 'Mendix',
    category: 'Low-Code',
    description: 'Draft cert to test transitions.',
    issue_date: 'Mar 2026',
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
    body: JSON.stringify(insertPayload)
  });

  if (!insertRes.ok) {
    console.error('Insert failed:', await insertRes.text());
    process.exit(1);
  }

  const insertData = await insertRes.json();
  const certId = insertData[0].id;
  console.log(`Created ID: ${certId} with Status: "${insertData[0].status}" and Featured: ${insertData[0].is_featured}`);

  // Step 3: Transition Draft -> Published
  console.log('\nTransitioning Draft -> Published...');
  const publishRes = await fetch(`${url}/rest/v1/certifications?id=eq.${certId}`, {
    method: 'PATCH',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ status: 'published' })
  });

  if (!publishRes.ok) {
    console.error('Publish transition failed:', await publishRes.text());
    process.exit(1);
  }

  const publishData = await publishRes.json();
  console.log(`Updated Status: "${publishData[0].status}" (Expected: "published")`);

  // Step 4: Toggle Unfeatured -> Featured
  console.log('\nToggle Unfeatured -> Featured...');
  const featureRes = await fetch(`${url}/rest/v1/certifications?id=eq.${certId}`, {
    method: 'PATCH',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ is_featured: true })
  });

  if (!featureRes.ok) {
    console.error('Feature toggle failed:', await featureRes.text());
    process.exit(1);
  }

  const featureData = await featureRes.json();
  console.log(`Updated Featured state: ${featureData[0].is_featured} (Expected: true)`);

  // Step 5: Transition Published -> Draft
  console.log('\nTransitioning Published -> Draft...');
  const draftRes = await fetch(`${url}/rest/v1/certifications?id=eq.${certId}`, {
    method: 'PATCH',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ status: 'draft' })
  });

  if (!draftRes.ok) {
    console.error('Draft transition failed:', await draftRes.text());
    process.exit(1);
  }

  const draftData = await draftRes.json();
  console.log(`Updated Status: "${draftData[0].status}" (Expected: "draft")`);

  // Step 6: Toggle Featured -> Unfeatured
  console.log('\nToggle Featured -> Unfeatured...');
  const unfeatureRes = await fetch(`${url}/rest/v1/certifications?id=eq.${certId}`, {
    method: 'PATCH',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ is_featured: false })
  });

  if (!unfeatureRes.ok) {
    console.error('Unfeature toggle failed:', await unfeatureRes.text());
    process.exit(1);
  }

  const unfeatureData = await unfeatureRes.json();
  console.log(`Updated Featured state: ${unfeatureData[0].is_featured} (Expected: false)`);

  // Step 7: Cleanup
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
