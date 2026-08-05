const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const ENV_PATH = path.join(__dirname, '..', '.env');
const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');
const DEV_REF = 'xpuhbtsgwhgbcvmwzlyd';
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

async function applyMigrationsToDb(ref, dbName) {
  console.log(`\n====================================================`);
  console.log(`Processing database: ${dbName} (${ref})`);
  console.log(`====================================================`);

  const connectionString = `postgresql://postgres.${ref}:${encodeURIComponent(dbPassword)}@aws-1-ap-south-1.pooler.supabase.com:5432/postgres`;
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log(`Connected successfully to ${dbName}.`);

    // Get list of already applied migrations from supabase_migrations.schema_migrations
    const res = await client.query('SELECT version FROM supabase_migrations.schema_migrations ORDER BY version ASC');
    const appliedVersions = new Set(res.rows.map(row => row.version));
    console.log(`Found ${appliedVersions.size} migrations already applied.`);

    // Read local migrations
    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort();

    let appliedCount = 0;
    for (const file of migrationFiles) {
      const match = file.match(/^(\d+)_/);
      if (!match) continue;
      
      const version = match[1];

      if (appliedVersions.has(version)) {
        continue;
      }

      console.log(`🚀 Applying missing migration: ${file} (Version: ${version})`);
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO supabase_migrations.schema_migrations (version) VALUES ($1)', [version]);
        await client.query('COMMIT');
        console.log(`✅ Successfully applied: ${file}`);
        appliedCount++;
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ FAILED to apply: ${file}`);
        console.error(err);
        throw err;
      }
    }

    if (appliedCount === 0) {
      console.log(`🎉 ${dbName} database is already up to date!`);
    } else {
      console.log(`🎉 Successfully applied ${appliedCount} missing migration(s) to ${dbName}!`);
    }

  } catch (err) {
    console.error(`Error processing ${dbName}:`, err.message);
  } finally {
    await client.end();
  }
}

async function main() {
  await applyMigrationsToDb(DEV_REF, 'DEV');
  await applyMigrationsToDb(PROD_REF, 'PROD');
}

main().catch(console.error);
