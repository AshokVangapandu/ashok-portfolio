const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const ENV_PATH = path.join(__dirname, '..', '.env');
const PROD_REF = 'txoszrnjkrlbjzpjisvp';

// Read production password from .env
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

const sql = `
CREATE OR REPLACE FUNCTION public.get_supabase_url()
RETURNS text AS $$
BEGIN
  RETURN COALESCE(
    NULLIF(current_setting('app.settings.supabase_url', true), ''),
    'https://txoszrnjkrlbjzpjisvp.supabase.co'
  );
END;
$$ LANGUAGE plpgsql;
`;

async function main() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to Production database...');
    await client.connect();
    console.log('Connected successfully.');

    console.log('Executing SQL to recreate get_supabase_url()...');
    await client.query(sql);
    console.log('✅ Recreated get_supabase_url() successfully in Production!');

  } catch (err) {
    console.error('❌ Failed to run query:', err);
  } finally {
    await client.end();
  }
}

main();
