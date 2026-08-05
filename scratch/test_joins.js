const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const ENV_PATH = path.join(__dirname, '..', '.env');
const PROD_REF = 'txoszrnjkrlbjzpjisvp';

// Read database password
let dbPassword = process.env.PRODUCTION_DB_PASSWORD;
if (!dbPassword && fs.existsSync(ENV_PATH)) {
  const envContent = fs.readFileSync(ENV_PATH, 'utf8');
  const match = envContent.match(/PRODUCTION_DB_PASSWORD=(.*)/);
  if (match) {
    dbPassword = match[1].trim();
  }
}

if (!dbPassword) {
  console.error('Error: PRODUCTION_DB_PASSWORD not found in environment or .env file.');
  process.exit(1);
}

const connectionString = `postgresql://postgres.${PROD_REF}:${encodeURIComponent(dbPassword)}@aws-1-ap-south-1.pooler.supabase.com:5432/postgres`;

async function test() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to database.');

    const sql = `
      SELECT 
        s.id as session_id,
        s.visitor_id,
        s.country,
        s.city,
        p.full_name,
        p.email,
        pv.page_path,
        pv.page_title
      FROM public.visitor_sessions s
      LEFT JOIN public.visitor_profiles p ON s.visitor_id = p.visitor_id
      LEFT JOIN public.page_views pv ON s.id = pv.session_id
      ORDER BY s.created_at DESC;
    `;
    const res = await client.query(sql);
    console.log('Query result count:', res.rows.length);
    console.log('Sample rows:', res.rows.slice(0, 3));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

test();
