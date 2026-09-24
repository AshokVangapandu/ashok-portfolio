// scratch/inspect_testimonials_full.ts
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

async function inspect() {
  console.log('--- 1. Querying with no filter ---');
  const { data: allData, error: allErr } = await supabase
    .from('testimonials')
    .select('*');
  console.log('Returned rows count:', allData?.length, 'error:', allErr);
  console.log('Rows:', JSON.stringify(allData, null, 2));

  console.log('\n--- 2. Querying with is(deleted_at, null) ---');
  const { data: notDeleted, error: delErr } = await supabase
    .from('testimonials')
    .select('*')
    .is('deleted_at', null);
  console.log('Not deleted count:', notDeleted?.length, 'error:', delErr);
}

inspect();
