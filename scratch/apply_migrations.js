const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const ENV_PATH = path.join(__dirname, '..', '.env');
const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');
const PROD_REF = 'txoszrnjkrlbjzpjisvp';

// 1. Read production password from .env
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

// 2. Build Postgres Connection String using Supabase Pooler
const connectionString = `postgresql://postgres.${PROD_REF}:${encodeURIComponent(dbPassword)}@aws-1-ap-south-1.pooler.supabase.com:5432/postgres`;

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

    // Get list of already applied migrations from supabase_migrations.schema_migrations
    console.log('Fetching applied migrations...');
    const res = await client.query('SELECT version FROM supabase_migrations.schema_migrations ORDER BY version ASC');
    const appliedVersions = new Set(res.rows.map(row => row.version));
    console.log(`Found ${appliedVersions.size} migrations already applied to Production.`);

    // Read local migrations
    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort(); // ensures chronological application

    console.log(`Checking ${migrationFiles.length} local migration files...`);

    let appliedCount = 0;
    for (const file of migrationFiles) {
      // The version is the numeric prefix of the filename (e.g., '20260804200000')
      const match = file.match(/^(\d+)_/);
      if (!match) {
        console.warn(`⚠️ Skipping file with invalid migration name: ${file}`);
        continue;
      }
      
      const version = match[1];

      if (appliedVersions.has(version)) {
        // Already applied
        continue;
      }

      console.log(`\n🚀 Applying missing migration: ${file} (Version: ${version})`);
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

      // Start transaction for this migration file
      await client.query('BEGIN');
      try {
        // Execute the migration SQL
        await client.query(sql);
        
        // Record migration version in history
        await client.query('INSERT INTO supabase_migrations.schema_migrations (version) VALUES ($1)', [version]);
        
        await client.query('COMMIT');
        console.log(`✅ Successfully applied: ${file}`);
        appliedCount++;
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ FAILED to apply: ${file}`);
        console.error(err);
        process.exit(1);
      }
    }

    console.log(`\n====================================================`);
    if (appliedCount === 0) {
      console.log('🎉 Production database is already up to date!');
    } else {
      console.log(`🎉 Successfully applied ${appliedCount} missing migration(s) to Production!`);
    }
    console.log(`====================================================`);

  } catch (err) {
    console.error('Fatal database error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
