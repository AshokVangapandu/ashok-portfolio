// scratch/test_homepage_integration.js
const url = 'https://txoszrnjkrlbjzpjisvp.supabase.co';
const anonKey = 'sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB';

async function runTests() {
  console.log('--- Phase 9 Homepage Certifications Section Test ---');

  // Query only published records (public permission mock)
  console.log('Querying public certifications table...');
  const res = await fetch(`${url}/rest/v1/certifications?status=eq.published&order=created_at.desc`, {
    method: 'GET',
    headers: {
      'apikey': anonKey,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    console.error('Fetch failed:', await res.text());
    process.exit(1);
  }

  const certifications = await res.json();
  console.log('Total Published Certifications Fetched:', certifications.length);

  // 1. Verify Draft Exclusion (attempt to fetch draft rows without admin auth)
  console.log('\nChecking if draft certifications are hidden from public...');
  const draftCheckRes = await fetch(`${url}/rest/v1/certifications?status=eq.draft`, {
    method: 'GET',
    headers: {
      'apikey': anonKey,
      'Content-Type': 'application/json'
    }
  });
  const draftsFetched = await draftCheckRes.json();
  console.log('Draft rows visible to anonymous public:', draftsFetched.length);
  if (draftsFetched.length === 0) {
    console.log('SUCCESS: Draft certifications are safely hidden behind RLS/public filters!');
  } else {
    console.warn('WARNING: Draft rows returned for public query. Check RLS or filters.');
  }

  // 2. Derive unique providers
  const uniqueProviders = [];
  const seenProviders = new Set();
  certifications.forEach(c => {
    if (c.issuer) {
      const norm = c.issuer.toLowerCase().trim();
      if (!seenProviders.has(norm)) {
        seenProviders.add(norm);
        uniqueProviders.push(c.issuer);
      }
    }
  });

  console.log('\nDerived Unique Providers:', uniqueProviders);
  console.log('Provider Limit (Slices at 6):', uniqueProviders.slice(0, 6));

  // 3. Verify statistics
  const totalCount = certifications.length;
  const verifiedCount = certifications.filter(c => c.credential_url && c.credential_url.trim() !== "").length;
  const verifiedPercent = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  console.log('\nDynamic Homepage Stats Calculation:');
  console.log(`- Total Published Certifications count: ${totalCount}+`);
  console.log(`- Verified percentage: ${verifiedPercent}% (based on ${verifiedCount} verified out of ${totalCount} total)`);
}

runTests();
