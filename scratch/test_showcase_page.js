// scratch/test_showcase_page.js
const url = 'https://txoszrnjkrlbjzpjisvp.supabase.co';
const anonKey = 'sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB';

async function runTests() {
  console.log('--- Phase 10 public certifications showcase page integration check ---');

  // Query only published records (public select permission mock)
  console.log('Querying public certifications...');
  const res = await fetch(`${url}/rest/v1/certifications?status=eq.published&order=display_order.asc,created_at.desc`, {
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

  // 2. Verify Statistics Calculations
  const totalCount = certifications.length;
  const seenPlatforms = new Set();
  certifications.forEach(c => {
    if (c.issuer) {
      seenPlatforms.add(c.issuer.toLowerCase().trim());
    }
  });
  const uniquePlatformsCount = seenPlatforms.size;

  const verifiedCount = certifications.filter(c => c.credential_url && c.credential_url.trim() !== "").length;
  const verifiedPercent = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  console.log('\nDynamic Stats:');
  console.log(`- Certifications Count Stat: ${totalCount}+`);
  console.log(`- Platforms Count Stat: ${uniquePlatformsCount}`);
  console.log(`- Verified Percent Stat: ${verifiedPercent}%`);

  // 3. Search Matching Mock
  const mockQueries = ['Google', 'AWS', 'Mendix'];
  console.log('\nTesting search queries match:');
  mockQueries.forEach(query => {
    const normQuery = query.toLowerCase();
    const matches = certifications.filter(c => 
      c.title?.toLowerCase().includes(normQuery) ||
      c.issuer?.toLowerCase().includes(normQuery) ||
      (c.skills && c.skills.some(s => s.toLowerCase().includes(normQuery)))
    );
    console.log(`- Search query "${query}" matches: ${matches.length} certifications`);
  });
}

runTests();
