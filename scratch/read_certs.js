// scratch/read_certs.js
const url = 'https://txoszrnjkrlbjzpjisvp.supabase.co';
const anonKey = 'sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB';

async function readCerts() {
  const res = await fetch(`${url}/rest/v1/certifications?order=created_at.desc`, {
    method: 'GET',
    headers: {
      'apikey': anonKey,
      'Content-Type': 'application/json'
    }
  });

  const certs = await res.json();
  console.log(JSON.stringify(certs, null, 2));
}

readCerts();
