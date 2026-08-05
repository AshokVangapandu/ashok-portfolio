const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const ENV_PATH = path.join(__dirname, '..', '.env');
const DEV_REF = 'xpuhbtsgwhgbcvmwzlyd';

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
  console.error('Error: Database password not found.');
  process.exit(1);
}

const connectionString = `postgresql://postgres.${DEV_REF}:${encodeURIComponent(dbPassword)}@aws-1-ap-south-1.pooler.supabase.com:5432/postgres`;

async function main() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to DEV database.');

    console.log('Creating temporary select policies for anon role...');
    await client.query('DROP POLICY IF EXISTS temp_anon_select ON public.visitor_profiles');
    await client.query('CREATE POLICY temp_anon_select ON public.visitor_profiles FOR SELECT TO anon USING (true)');

    await client.query('DROP POLICY IF EXISTS temp_anon_select ON public.visitor_sessions');
    await client.query('CREATE POLICY temp_anon_select ON public.visitor_sessions FOR SELECT TO anon USING (true)');

    await client.query('DROP POLICY IF EXISTS temp_anon_select ON public.page_views');
    await client.query('CREATE POLICY temp_anon_select ON public.page_views FOR SELECT TO anon USING (true)');

    console.log('✔ Temporary policies created successfully on DEV.');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
