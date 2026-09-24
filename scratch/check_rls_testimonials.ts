// scratch/check_rls_testimonials.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Let's check all migration files for testimonials RLS policies
const migrationsDir = path.join(rootDir, 'supabase', 'migrations');
const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));

console.log('--- Scanning migrations for testimonials policies ---');
for (const file of files) {
  const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  if (content.includes('testimonials') && content.includes('POLICY')) {
    console.log(`\n=== File: ${file} ===`);
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('POLICY') || line.includes('CREATE POLICY') || line.includes('DROP POLICY') || line.includes('ON public.testimonials')) {
        console.log(`L${idx + 1}: ${line}`);
      }
    });
  }
}
