const { Client } = require('pg');

const DEV_REF = 'xpuhbtsgwhgbcvmwzlyd';
const PROD_REF = 'txoszrnjkrlbjzpjisvp';
const dbPassword = 'Asher@4tyfive';

const devConn = `postgresql://postgres.${DEV_REF}:${encodeURIComponent(dbPassword)}@aws-1-ap-south-1.pooler.supabase.com:5432/postgres`;
const prodConn = `postgresql://postgres.${PROD_REF}:${encodeURIComponent(dbPassword)}@aws-1-ap-south-1.pooler.supabase.com:5432/postgres`;

async function checkDb(name, connStr) {
  const client = new Client({
    connectionString: connStr,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log(`\n=== Testimonials in ${name} ===`);
    const res = await client.query('SELECT id, full_name, designation, company, status, is_visible, featured, linkedin_url FROM public.testimonials');
    console.log('Count:', res.rows.length);
    console.log('Rows:', res.rows);
  } catch (err) {
    console.error(`Failed to connect to ${name}:`, err.message);
  } finally {
    await client.end();
  }
}

async function main() {
  await checkDb('DEV', devConn);
  await checkDb('PRODUCTION', prodConn);
}

main();
