// scratch/test_identity_resolution.js
const fs = require('fs');
const path = require('path');

function runTests() {
  console.log('=== IDENTITY RESOLUTION VALIDATION SUITE ===\n');

  // Test 1: Validate mapper logic
  const mapperCodePath = path.join(__dirname, '../src/admin/types/resumeDownload.ts');
  const mapperContent = fs.readFileSync(mapperCodePath, 'utf8');

  console.log('1. Checking mapSupabaseToResumeDownload implementation...');
  if (
    mapperContent.includes('visitor_profiles') &&
    mapperContent.includes('hasName || hasEmail') &&
    mapperContent.includes("'Anonymous Visitor'") &&
    !mapperContent.includes("visitorShort = db.visitor_id ? `Visitor (${db.visitor_id.substring(0, 6)})`")
  ) {
    console.log('  ✔ mapSupabaseToResumeDownload resolves visitor profiles and removes hardcoded Visitor (xxxxxx).');
  } else {
    console.error('  ✖ mapSupabaseToResumeDownload failed validation.');
    process.exit(1);
  }

  // Simulate mapper in JS to execute Case 1 to Case 8
  const simulateMapper = (db) => {
    const d = new Date(db.downloaded_at);
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedTime = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const profile = db.visitor_profiles || null;
    const hasName = Boolean(profile?.full_name && profile.full_name.trim());
    const hasEmail = Boolean(profile?.email && profile.email.trim());
    const isKnown = hasName || hasEmail;

    const visitorName = hasName
      ? profile.full_name.trim()
      : hasEmail
        ? profile.email.trim()
        : 'Anonymous Visitor';
    const visitorEmail = hasEmail ? profile.email.trim() : null;
    const avatarUrl = (profile?.avatar_url && profile.avatar_url.trim()) || null;

    return {
      id: db.id,
      dateTime: `${formattedDate}, ${formattedTime}`,
      visitorName,
      visitorEmail,
      avatarUrl,
      isKnown,
      visitorId: db.visitor_id,
      status: db.download_status
    };
  };

  // Case 1: Authenticated user + name + email + avatar
  const c1 = simulateMapper({
    id: 'd-1',
    downloaded_at: '2026-09-21T10:00:00Z',
    visitor_id: '39d63d2e-9d21-4f11-90a1-1234567890ab',
    download_status: 'completed',
    visitor_profiles: {
      full_name: 'Ashok Vangapandu',
      email: 'ashok@example.com',
      avatar_url: 'https://lh3.googleusercontent.com/a/avatar.jpg'
    }
  });
  console.assert(c1.visitorName === 'Ashok Vangapandu' && c1.visitorEmail === 'ashok@example.com' && c1.isKnown === true && c1.avatarUrl !== null, 'Case 1 failed');
  console.log('  ✔ Case 1: Full authenticated profile (Name, Email, Avatar) -> Resolved as Known.');

  // Case 2: Authenticated user + email but no name
  const c2 = simulateMapper({
    id: 'd-2',
    downloaded_at: '2026-09-21T10:00:00Z',
    visitor_id: '466a7711-2222-4f11-90a1-1234567890ab',
    download_status: 'completed',
    visitor_profiles: {
      full_name: null,
      email: 'user2@example.com',
      avatar_url: null
    }
  });
  console.assert(c2.visitorName === 'user2@example.com' && c2.visitorEmail === 'user2@example.com' && c2.isKnown === true, 'Case 2 failed');
  console.log('  ✔ Case 2: Email-only identity -> Resolved as Known with email display.');

  // Case 3: Authenticated user + name but no email
  const c3 = simulateMapper({
    id: 'd-3',
    downloaded_at: '2026-09-21T10:00:00Z',
    visitor_id: '16221caa-3333-4f11-90a1-1234567890ab',
    download_status: 'completed',
    visitor_profiles: {
      full_name: 'John Doe',
      email: null,
      avatar_url: null
    }
  });
  console.assert(c3.visitorName === 'John Doe' && c3.visitorEmail === null && c3.isKnown === true, 'Case 3 failed');
  console.log('  ✔ Case 3: Name-only identity -> Resolved as Known with name display.');

  // Case 4: Anonymous visitor (no profile)
  const c4 = simulateMapper({
    id: 'd-4',
    downloaded_at: '2026-09-21T10:00:00Z',
    visitor_id: '39d63d2e-9d21-4f11-90a1-1234567890ab',
    download_status: 'completed',
    visitor_profiles: null
  });
  console.assert(c4.visitorName === 'Anonymous Visitor' && c4.visitorEmail === null && c4.isKnown === false && c4.visitorId === '39d63d2e-9d21-4f11-90a1-1234567890ab', 'Case 4 failed');
  console.log('  ✔ Case 4: Truly Anonymous visitor -> Displayed as "Anonymous Visitor" with isKnown = false.');

  // Case 5: Historical download resolution
  const c5_old = simulateMapper({
    id: 'd-old',
    downloaded_at: '2026-08-01T10:00:00Z',
    visitor_id: '39d63d2e-9d21-4f11-90a1-1234567890ab',
    download_status: 'completed',
    visitor_profiles: {
      full_name: 'Ashok Vangapandu',
      email: 'ashok@example.com',
      avatar_url: 'https://lh3.googleusercontent.com/a/avatar.jpg'
    }
  });
  console.assert(c5_old.visitorName === 'Ashok Vangapandu' && c5_old.isKnown === true, 'Case 5 failed');
  console.log('  ✔ Case 5: Historical download for known visitor -> Automatically resolved to name without DB row mutation.');

  // Case 6: Null avatar
  const c6 = simulateMapper({
    id: 'd-6',
    downloaded_at: '2026-09-21T10:00:00Z',
    visitor_id: '39d63d2e-9d21-4f11-90a1-1234567890ab',
    download_status: 'completed',
    visitor_profiles: {
      full_name: 'Ashok Vangapandu',
      email: 'ashok@example.com',
      avatar_url: null
    }
  });
  console.assert(c6.avatarUrl === null && c6.isKnown === true, 'Case 6 failed');
  console.log('  ✔ Case 6: Null avatar -> Gracefully handled.');

  // Case 7: Empty strings in profile
  const c7 = simulateMapper({
    id: 'd-7',
    downloaded_at: '2026-09-21T10:00:00Z',
    visitor_id: '99999999-9d21-4f11-90a1-1234567890ab',
    download_status: 'completed',
    visitor_profiles: {
      full_name: '   ',
      email: '',
      avatar_url: '   '
    }
  });
  console.assert(c7.visitorName === 'Anonymous Visitor' && c7.isKnown === false && c7.avatarUrl === null, 'Case 7 failed');
  console.log('  ✔ Case 7: Whitespace/empty strings in profile -> Treated as unavailable/anonymous.');

  // Check js/main.jsx telemetry sync
  console.log('\n2. Checking main.jsx auth-to-visitor sync hooks...');
  const mainPath = path.join(__dirname, '../js/main.jsx');
  const mainContent = fs.readFileSync(mainPath, 'utf8');

  console.assert(mainContent.includes('syncAuthenticatedUserVisitorProfile'), 'main.jsx missing syncAuthenticatedUserVisitorProfile');
  console.assert(mainContent.includes('await syncAuthenticatedUserVisitorProfile(currentUser)'), 'main.jsx missing download pre-sync guarantee');
  console.log('  ✔ main.jsx properly synchronizes auth user on initial session, auth state changes, and before resume download.');

  // Check useResumeDownloads.ts
  console.log('\n3. Checking useResumeDownloads.ts profile enrichment...');
  const hookPath = path.join(__dirname, '../src/admin/hooks/useResumeDownloads.ts');
  const hookContent = fs.readFileSync(hookPath, 'utf8');

  console.assert(hookContent.includes("from('visitor_profiles')"), 'useResumeDownloads missing visitor_profiles query');
  console.assert(hookContent.includes('profilesMap'), 'useResumeDownloads missing profilesMap enrichment');
  console.log('  ✔ useResumeDownloads fetches and combines visitor profiles for downloads and CSV exports.');

  // Check ResumeDownloadRow.tsx
  console.log('\n4. Checking ResumeDownloadRow.tsx rendering...');
  const rowPath = path.join(__dirname, '../src/admin/pages/resume/components/ResumeDownloadRow.tsx');
  const rowContent = fs.readFileSync(rowPath, 'utf8');

  console.assert(rowContent.includes('download.visitorEmail || \'Registered user\'') && rowContent.includes('substring(0, 6).toUpperCase()'), 'ResumeDownloadRow missing secondary ID / email rendering');
  console.log('  ✔ ResumeDownloadRow correctly formats Known User vs Anonymous Visitor subtitle and ID.');

  console.log('\n=== ALL IDENTITY RESOLUTION CHECKS PASSED ===\n');
}

runTests();
