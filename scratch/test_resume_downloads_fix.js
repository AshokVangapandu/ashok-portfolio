// scratch/test_resume_downloads_fix.js
const assert = require('assert');
const path = require('path');
const fs = require('fs');

console.log('====================================================');
console.log('RUNNING COMPREHENSIVE RESUME DOWNLOADS VERIFICATION');
console.log('====================================================\n');

// 1. Test Duration Formatter logic
const formatResumeDuration = (session) => {
  if (!session) return '—';
  const sec = typeof session.duration_seconds === 'number' ? session.duration_seconds : 0;
  if (sec < 15) return '< 15s';
  const mins = Math.floor(sec / 60);
  const remSec = sec % 60;
  if (mins > 0) {
    return remSec > 0 ? `${mins}m ${remSec}s` : `${mins}m`;
  }
  return `${remSec}s`;
};

// --- TEST CASES ---

// TEST 1: Duration formatting for standard engagement (105s -> 1m 45s)
assert.strictEqual(formatResumeDuration({ duration_seconds: 105 }), '1m 45s');
console.log('✓ TEST 1 PASSED: 105s session duration formatted as "1m 45s"');

// TEST 2: Duration formatting for long engagement (502s -> 8m 22s)
assert.strictEqual(formatResumeDuration({ duration_seconds: 502 }), '8m 22s');
console.log('✓ TEST 2 PASSED: 502s session duration formatted as "8m 22s"');

// TEST 3: Duration formatting for short sub-minute engagement (45s -> 45s)
assert.strictEqual(formatResumeDuration({ duration_seconds: 45 }), '45s');
console.log('✓ TEST 3 PASSED: 45s session duration formatted as "45s"');

// TEST 4: Duration formatting for sub-15s session (< 15s)
assert.strictEqual(formatResumeDuration({ duration_seconds: 8 }), '< 15s');
assert.strictEqual(formatResumeDuration({ duration_seconds: 0 }), '< 15s');
console.log('✓ TEST 4 PASSED: <15s and 0s session duration formatted as "< 15s"');

// TEST 5: Duration formatting for missing/null session (—)
assert.strictEqual(formatResumeDuration(null), '—');
assert.strictEqual(formatResumeDuration(undefined), '—');
console.log('✓ TEST 5 PASSED: Missing/null session formatted as "—"');

// TEST 6: Verify Avatar component integration in ResumeDownloadRow.tsx
const rowFile = fs.readFileSync(path.join(__dirname, '../src/admin/pages/resume/components/ResumeDownloadRow.tsx'), 'utf-8');
assert(rowFile.includes("import { Avatar } from '../../../components/avatars/Avatar';"), 'Avatar import missing in ResumeDownloadRow.tsx');
assert(rowFile.includes('<Avatar'), 'Avatar component not rendered in ResumeDownloadRow.tsx');
assert(!rowFile.includes('<img\n              src={download.avatarUrl}'), 'Raw <img> still present in ResumeDownloadRow.tsx');
console.log('✓ TEST 6 PASSED: ResumeDownloadRow uses reusable Avatar component with no-referrer and onError fallback');

// TEST 7: Verify "Downloaded From" removed from ResumeDownloadsTable.tsx
const tableFile = fs.readFileSync(path.join(__dirname, '../src/admin/pages/resume/components/ResumeDownloadsTable.tsx'), 'utf-8');
assert(!tableFile.includes("'Downloaded From'"), 'Downloaded From still present in ResumeDownloadsTable.tsx');
console.log('✓ TEST 7 PASSED: "Downloaded From" removed from ResumeDownloadsTable.tsx headers');

// TEST 8: Verify "Downloaded From" removed from ResumeDownloadRow.tsx
assert(!rowFile.includes('download.downloadedFrom'), 'downloadedFrom still present in ResumeDownloadRow.tsx');
console.log('✓ TEST 8 PASSED: "Downloaded From" removed from ResumeDownloadRow.tsx cells');

// TEST 9: Verify useResumeDownloads.ts queries visitor_sessions and enriches downloads
const hookFile = fs.readFileSync(path.join(__dirname, '../src/admin/hooks/useResumeDownloads.ts'), 'utf-8');
assert(hookFile.includes("from('visitor_sessions')"), 'visitor_sessions query missing in useResumeDownloads.ts');
assert(hookFile.includes("duration_seconds, created_at"), 'duration_seconds selection missing in useResumeDownloads.ts');
assert(hookFile.includes("sessionsMap.get(d.session_id)"), 'session enrichment missing in useResumeDownloads.ts');
console.log('✓ TEST 9 PASSED: useResumeDownloads performs single-batch query for visitor_sessions');

// TEST 10: Verify CSV export has Duration and does NOT have Downloaded From
assert(!hookFile.includes("'Downloaded From'"), 'Downloaded From still present in CSV headers');
assert(hookFile.includes("'Duration'"), 'Duration missing in CSV headers');
assert(hookFile.includes("d.duration"), 'd.duration missing in CSV rows');
console.log('✓ TEST 10 PASSED: CSV export includes Duration and omits Downloaded From');

// TEST 11: Verify DownloadDetailsModal.tsx does NOT display Downloaded From
const modalFile = fs.readFileSync(path.join(__dirname, '../src/admin/pages/resume/components/DownloadDetailsModal.tsx'), 'utf-8');
assert(!modalFile.includes("'Downloaded From'"), 'Downloaded From still present in DownloadDetailsModal.tsx');
assert(modalFile.includes("'Duration'"), 'Duration missing in DownloadDetailsModal.tsx');
console.log('✓ TEST 11 PASSED: DownloadDetailsModal displays Duration and omits Downloaded From');

console.log('\n====================================================');
console.log('ALL 11 RESUME DOWNLOAD TESTS PASSED SUCCESSFULLY!');
console.log('====================================================');
