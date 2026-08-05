const { Client } = require('pg');

const DEV_REF = 'xpuhbtsgwhgbcvmwzlyd';
const dbPassword = 'Asher@4tyfive';

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
    const res = await client.query('SELECT * FROM public.admins');
    console.log('Admins in DEV:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
