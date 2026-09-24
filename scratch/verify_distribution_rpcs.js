// scratch/verify_distribution_rpcs.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testRange(range) {
  console.log(`\n================ RANGE: ${range} ================`);

  const [devicesRes, browsersRes, osRes] = await Promise.all([
    supabase.rpc('get_analytics_devices', { range_filter: range }),
    supabase.rpc('get_analytics_browsers', { range_filter: range }),
    supabase.rpc('get_analytics_operating_systems', { range_filter: range }),
  ]);

  console.log('Devices:', JSON.stringify(devicesRes.data, null, 2));
  console.log('Browsers:', JSON.stringify(browsersRes.data, null, 2));
  console.log('Operating Systems:', JSON.stringify(osRes.data, null, 2));

  // Verification checks
  if (browsersRes.data) {
    const nonOthers = browsersRes.data.filter(b => b.name !== 'Others');
    const others = browsersRes.data.find(b => b.name === 'Others');
    console.log(`Browsers check: ${nonOthers.length} top categories, Others present: ${!!others}`);
  }

  if (osRes.data) {
    const nonOthers = osRes.data.filter(o => o.name !== 'Others');
    const others = osRes.data.find(o => o.name === 'Others');
    console.log(`OS check: ${nonOthers.length} top categories, Others present: ${!!others}`);
  }
}

async function run() {
  for (const r of ['today', '7days', '30days', '90days']) {
    await testRange(r);
  }
}

run().catch(console.error);
