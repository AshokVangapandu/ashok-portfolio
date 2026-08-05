const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const ENV_PATH = path.join(__dirname, '..', '.env');
const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');
const DEV_REF = 'xpuhbtsgwhgbcvmwzlyd';

// 1. Read password from .env
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

// 2. Build Postgres Connection String
const connectionString = `postgresql://postgres.${DEV_REF}:${encodeURIComponent(dbPassword)}@aws-1-ap-south-1.pooler.supabase.com:5432/postgres`;

async function main() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to DEV database...');
    await client.connect();
    console.log('Connected successfully.');

    // Ensure schema migrations table exists
    await client.query(`
      CREATE SCHEMA IF NOT EXISTS supabase_migrations;
      CREATE TABLE IF NOT EXISTS supabase_migrations.schema_migrations (
        version VARCHAR(255) PRIMARY KEY
      );
    `);

    // Get list of already applied migrations
    console.log('Fetching applied migrations...');
    const res = await client.query('SELECT version FROM supabase_migrations.schema_migrations ORDER BY version ASC');
    const appliedVersions = new Set(res.rows.map(row => row.version));
    console.log(`Found ${appliedVersions.size} migrations already applied to DEV.`);

    // Read local migrations
    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`Checking ${migrationFiles.length} local migration files...`);

    let appliedCount = 0;
    for (const file of migrationFiles) {
      const match = file.match(/^(\d+)_/);
      if (!match) continue;
      
      const version = match[1];
      if (appliedVersions.has(version)) {
        continue;
      }

      console.log(`\n🚀 Applying missing migration: ${file} (Version: ${version})`);
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      // Execute SQL content
      await client.query(sql);

      // Record as applied
      await client.query('INSERT INTO supabase_migrations.schema_migrations (version) VALUES ($1)', [version]);
      console.log(`✅ Successfully applied: ${file}`);
      appliedCount++;
    }

    console.log('\n====================================================');
    console.log(`🎉 Successfully applied ${appliedCount} missing migration(s) to DEV!`);
    console.log('====================================================');

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
