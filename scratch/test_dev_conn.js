const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const ENV_PATH = path.join(__dirname, '..', '.env');
const DEV_REF = 'xpuhbtsgwhgbcvmwzlyd';

let dbPassword = process.env.PRODUCTION_DB_PASSWORD;
if (!dbPassword && fs.existsSync(ENV_PATH)) {
  const envContent = fs.readFileSync(ENV_PATH, 'utf8');
  const match = envContent.match(/PRODUCTION_DB_PASSWORD=(.*)/);
  if (match) {
    dbPassword = match[1].trim();
  }
}

const connectionString = `postgresql://postgres.${DEV_REF}:${encodeURIComponent(dbPassword)}@aws-1-ap-south-1.pooler.supabase.com:5432/postgres`;

async function main() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ DEV database connected successfully using the Production password!');
  } catch (err) {
    console.log('❌ DEV database connection failed:', err.message);
  } finally {
    await client.end();
  }
}

main();
