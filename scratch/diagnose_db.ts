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

const supabase = createClient(env['VITE_SUPABASE_URL'], env['VITE_SUPABASE_ANON_KEY']);

async function diagnose() {
  console.log('--- DIAGNOSE TESTIMONIALS SCHEMA & POLICIES ---');
  const { data, error } = await supabase.from('testimonials').select('*');
  console.log('Select existing:', { error, count: data?.length, sample: data?.[0] });

  // Test variations
  const tests = [
    {
      desc: 'All columns matching Ashok V default types',
      payload: {
        full_name: 'Test All Cols',
        email: 'testall@example.com',
        rating: 5,
        testimonial: 'Test review message',
        status: 'pending',
        featured: false,
        display_order: 0,
        is_visible: true,
        company: 'Comp',
        designation: 'Desig',
        country: 'India',
        avatar_url: null,
        linkedin_url: null,
        admin_notes: null,
        user_id: null,
        deleted_at: null,
        approved_at: null,
        approved_by: null,
        rejected_at: null,
        rejected_by: null
      }
    },
    {
      desc: 'With is_visible: true, featured: false, display_order: 0',
      payload: { full_name: 'PV', email: 'pv@example.com', rating: 5, testimonial: 'Test', status: 'pending', is_visible: true, featured: false, display_order: 0 }
    },
    {
      desc: 'With is_visible: false, featured: false, display_order: 0',
      payload: { full_name: 'PI', email: 'pi@example.com', rating: 5, testimonial: 'Test', status: 'pending', is_visible: false, featured: false, display_order: 0 }
    },
    {
      desc: 'With dummy uuid user_id',
      payload: { full_name: 'UUID', email: 'u@example.com', rating: 5, testimonial: 'Test', status: 'pending', is_visible: true, featured: false, user_id: '00000000-0000-0000-0000-000000000000' }
    }
  ];

  for (const t of tests) {
    const { data: insData, error: insErr } = await supabase.from('testimonials').insert([t.payload]).select();
    console.log(`\nTest: ${t.desc}`);
    if (insErr) {
      console.log(`  ❌ Failed: ${insErr.code} - ${insErr.message}`);
    } else {
      console.log(`  ✅ Succeeded:`, insData);
    }
  }
}

diagnose();
