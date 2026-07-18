// scratch/test_resume_service.js
const url = 'https://txoszrnjkrlbjzpjisvp.supabase.co';
const anonKey = 'sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB';

async function runTests() {
  console.log('--- Phase 1: Resume settings backend service checks ---');

  // 1. Fetch public active resume
  console.log('Fetching active resume publicly...');
  const res = await fetch(`${url}/rest/v1/resume_settings?is_active=eq.true`, {
    method: 'GET',
    headers: {
      'apikey': anonKey,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    console.error('Fetch active failed:', await res.text());
    process.exit(1);
  }

  const activeResumes = await res.json();
  console.log('Active resumes visible publicly:', activeResumes.length);
  if (activeResumes.length <= 1) {
    console.log('SUCCESS: Active resumes count is compliant (0 or 1)');
  } else {
    console.error('FAIL: More than one active resume returned! Check trigger.');
    process.exit(1);
  }

  // 2. Try fetching non-active resumes publicly (should return 0 rows due to RLS)
  console.log('\nChecking if inactive resumes are hidden from public SELECT...');
  const inactiveRes = await fetch(`${url}/rest/v1/resume_settings?is_active=eq.false`, {
    method: 'GET',
    headers: {
      'apikey': anonKey,
      'Content-Type': 'application/json'
    }
  });
  const inactiveRows = await inactiveRes.json();
  console.log('Inactive rows visible publicly:', inactiveRows.length);
  if (inactiveRows.length === 0) {
    console.log('SUCCESS: Inactive resumes are safely hidden behind RLS!');
  } else {
    console.warn('WARNING: Inactive resume rows returned for public query. Check RLS policies.');
  }
}

runTests();
