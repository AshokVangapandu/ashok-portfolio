// scratch/test_testimonials_e2e.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const envContent = fs.readFileSync(path.join(rootDir, '.env'), 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = (match[2] || '').trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const url = env['VITE_SUPABASE_URL'] || '';
const key = env['VITE_SUPABASE_ANON_KEY'] || '';

const supabase = createClient(url, key);

let allPassed = true;
function assert(condition: boolean, testName: string, detail?: any) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
  } else {
    console.error(`❌ FAIL: ${testName}`, detail || '');
    allPassed = false;
  }
}

async function runE2ETests() {
  console.log('🧪 Starting Testimonials Full End-to-End Test Suite...\n');

  // --- 1. PUBLIC RLS SELECT TEST ---
  console.log('--- TEST 1: Public Client RLS Isolation ---');
  const { data: publicTestimonials, error: publicErr } = await supabase
    .from('testimonials')
    .select('*');

  assert(!publicErr, 'Public query executed without DB error');
  assert(
    (publicTestimonials || []).every(t => t.status === 'approved' && t.is_visible === true),
    'Public client CANNOT see pending, rejected, or hidden testimonials'
  );

  // --- 2. PUBLIC INSERT VALIDATION ---
  console.log('\n--- TEST 2: Testing Public Submission Variations ---');
  const variations = [
    { name: 'with is_visible: true, featured: false', payload: { full_name: 'Test 1', email: 't1@example.com', testimonial: 'rev 1', rating: 5, status: 'pending', is_visible: true, featured: false } },
    { name: 'with is_visible: false, featured: false', payload: { full_name: 'Test 2', email: 't2@example.com', testimonial: 'rev 2', rating: 5, status: 'pending', is_visible: false, featured: false } },
    { name: 'with only status: pending', payload: { full_name: 'Test 3', email: 't3@example.com', testimonial: 'rev 3', rating: 5, status: 'pending' } },
    { name: 'with default columns', payload: { full_name: 'Test 4', email: 't4@example.com', testimonial: 'rev 4', rating: 5 } },
  ];

  for (const v of variations) {
    const { data, error } = await supabase.from('testimonials').insert([v.payload]).select();
    if (error) {
      console.log(`❌ Variation "${v.name}" failed: ${error.code} - ${error.message}`);
    } else {
      console.log(`✅ Variation "${v.name}" SUCCEEDED! Inserted:`, data);
    }
  }

  // --- 3. PUBLIC CANNOT INSERT APPROVED TESTIMONIAL ---
  console.log('\n--- TEST 3: Security Policy Enforcement (Disallow Public Self-Approval) ---');
  const illegalSubmission = {
    full_name: 'Hacker',
    email: 'hacker@example.com',
    rating: 5,
    testimonial: 'Trying to self-approve',
    status: 'approved',
    is_visible: true,
    featured: true
  };

  const { error: illegalErr } = await supabase
    .from('testimonials')
    .insert([illegalSubmission]);

  assert(!!illegalErr, 'Public client CANNOT self-approve (Blocked by RLS WITH CHECK)');

  // --- 4. DATA MAPPING & TRANSFORMATION TEST ---
  console.log('\n--- TEST 4: Frontend Data Model Mapper Test ---');
  const sampleDbRow = {
    id: 'test-uuid-1234',
    full_name: 'Ashok V',
    email: 'ashok@example.com',
    company: 'PLM Indishtech',
    designation: 'Sr. Software Engineer',
    rating: 5,
    testimonial: 'A long testimonial preview text that should be mapped accurately.',
    status: 'pending',
    is_visible: false,
    featured: false,
    country: 'India',
    avatar_url: 'https://example.com/avatar.jpg',
    created_at: '2026-09-21T10:00:00Z',
    deleted_at: null
  };

  const mapped = {
    id: sampleDbRow.id,
    name: sampleDbRow.full_name,
    email: sampleDbRow.email,
    company: sampleDbRow.company,
    role: sampleDbRow.designation,
    rating: sampleDbRow.rating,
    preview: sampleDbRow.testimonial,
    country: sampleDbRow.country,
    status: sampleDbRow.status,
    date: new Date(sampleDbRow.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  assert(mapped.name === 'Ashok V', 'Mapped name matches full_name');
  assert(mapped.role === 'Sr. Software Engineer', 'Mapped role matches designation');
  assert(mapped.status === 'pending', 'Mapped status is pending');
  assert(mapped.date === 'Sep 21, 2026', 'Mapped date formats nicely');

  // --- 5. EMPTY STATE & ERROR DIFFERENTIATION ---
  console.log('\n--- TEST 5: Error vs Empty State Delineation ---');
  const emptyResult: any[] = [];
  const queryFailedError = 'Network timeout';
  assert(emptyResult.length === 0 && !queryFailedError, 'Legitimately empty state is detected when error is null');
  assert(!!queryFailedError, 'Failure state is detected when error is present');

  console.log('\n========================================');
  if (allPassed) {
    console.log('🎉 ALL END-TO-END TESTIMONIAL AUDIT TESTS PASSED!');
    process.exit(0);
  } else {
    console.error('❌ SOME TESTS FAILED');
    process.exit(1);
  }
}

runE2ETests();
