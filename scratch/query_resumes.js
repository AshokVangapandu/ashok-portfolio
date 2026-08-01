const url = 'https://xpuhbtsgwhgbcvmwzlyd.supabase.co';
const anonKey = 'sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z';

async function main() {
  const res = await fetch(`${url}/rest/v1/resume_settings`, {
    method: 'GET',
    headers: {
      'apikey': anonKey,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    console.error('Fetch failed:', await res.text());
    return;
  }
  
  console.log('Response Headers:');
  for (let [key, value] of res.headers.entries()) {
    console.log(`  ${key}: ${value}`);
  }

  const data = await res.json();
  console.log('\nResume Settings currently in DB:');
  console.log(JSON.stringify(data, null, 2));
}

main();
