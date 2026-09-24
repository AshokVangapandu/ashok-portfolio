// scratch/test_db_investigation.ts
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

async function run() {
  console.log('--- 1. Querying public.testimonials under Anon Key ---');
  const { data: anonTestimonials, error: anonErr } = await supabase
    .from('testimonials')
    .select('*');
  console.log('Anon Testimonials Count:', anonTestimonials?.length, 'Error:', anonErr);
  if (anonTestimonials) {
    console.log('Anon Testimonials:', anonTestimonials);
  }

  console.log('\n--- 2. Querying public.admins under Anon Key ---');
  const { data: admins, error: adminErr } = await supabase
    .from('admins')
    .select('*');
  console.log('Admins Count:', admins?.length, 'Error:', adminErr);
  if (admins) {
    console.log('Admins:', admins);
  }
}

run();
