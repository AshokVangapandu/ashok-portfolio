// scratch/inspect_qa_details.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function inspect() {
  console.log('--- 1. Inspecting NodeJS Sessions ---');
  const { data: nodeSessions, error: nodeErr } = await supabase
    .from('visitor_sessions')
    .select('id, visitor_id, browser, operating_system, device_type, user_agent, traffic_source, created_at, ip_address, city, country')
    .eq('browser', 'NodeJS')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (nodeErr) console.error(nodeErr);
  else console.log(JSON.stringify(nodeSessions, null, 2));

  console.log('\n--- 2. Inspecting OS Values in Database ---');
  const { data: allOS, error: osErr } = await supabase
    .from('visitor_sessions')
    .select('operating_system, browser, user_agent, created_at')
    .order('created_at', { ascending: false });

  if (osErr) {
    console.error(osErr);
  } else {
    const osCounts = {};
    allOS.forEach(s => {
      const os = s.operating_system || '(null)';
      osCounts[os] = (osCounts[os] || 0) + 1;
    });
    console.log('OS Raw Distribution in entire DB:', osCounts);

    const otherSamples = allOS.filter(s => s.operating_system === 'Other' || s.operating_system === 'Others' || !s.operating_system);
    console.log('\nSamples of OS === "Other" or null:', JSON.stringify(otherSamples.slice(0, 8), null, 2));
  }

  console.log('\n--- 3. Testing RPC Output vs Math for all Ranges ---');
  for (const range of ['today', '7days', '30days', '90days']) {
    const [dev, br, os] = await Promise.all([
      supabase.rpc('get_analytics_devices', { range_filter: range }),
      supabase.rpc('get_analytics_browsers', { range_filter: range }),
      supabase.rpc('get_analytics_operating_systems', { range_filter: range }),
    ]);

    console.log(`\n=== RANGE: ${range} ===`);
    console.log('DEVICES:', dev.data);
    const devPctSum = (dev.data || []).reduce((acc, d) => acc + d.percentage, 0);
    const devCountSum = (dev.data || []).reduce((acc, d) => acc + d.count, 0);
    console.log(`Device Totals -> Count: ${devCountSum}, PctSum: ${devPctSum}%`);

    console.log('BROWSERS:', br.data);
    const brPctSum = (br.data || []).reduce((acc, b) => acc + b.percentage, 0);
    const brCountSum = (br.data || []).reduce((acc, b) => acc + b.count, 0);
    console.log(`Browser Totals -> Count: ${brCountSum}, PctSum: ${brPctSum}%`);

    console.log('OS:', os.data);
    const osPctSum = (os.data || []).reduce((acc, o) => acc + o.percentage, 0);
    const osCountSum = (os.data || []).reduce((acc, o) => acc + o.count, 0);
    console.log(`OS Totals -> Count: ${osCountSum}, PctSum: ${osPctSum}%`);
  }
}

inspect().catch(console.error);
