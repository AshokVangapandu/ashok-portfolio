// scratch/inspect_admins.ts
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

async function check() {
  console.log('--- Checking public.testimonials with anon key ---');
  const { data: tests, error: testErr } = await supabase
    .from('testimonials')
    .select('*');
  console.log('Testimonials returned under anon:', tests?.length, 'error:', testErr);
  if (tests) {
    tests.forEach(t => console.log('Testimonial:', t.id, t.full_name, t.status, 'is_visible:', t.is_visible, 'deleted_at:', t.deleted_at));
  }

  console.log('\n--- Checking public.admins ---');
  const { data: admins, error: adminErr } = await supabase
    .from('admins')
    .select('*');
  console.log('Admins returned:', admins?.length, 'error:', adminErr);
  if (admins) {
    admins.forEach(a => console.log('Admin:', a.id, a.email, a.full_name, a.is_active));
  }
}

check();
