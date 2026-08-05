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

async function seed() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully. Seeding test analytics...');

    // 1. Seed visitor profile
    const profileSql = `
      INSERT INTO public.visitor_profiles (visitor_id, full_name, email, avatar_url, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (visitor_id) DO UPDATE
      SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, avatar_url = EXCLUDED.avatar_url, updated_at = NOW();
    `;
    await client.query(profileSql, [
      'v_test_ashok',
      'Ashok Vangapandu',
      'ashok@example.com',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    ]);
    console.log('✔ Seeded public.visitor_profiles.');

    // 2. Seed session
    const sessionSql = `
      INSERT INTO public.visitor_sessions (id, visitor_id, ip_address, country, city, browser, operating_system, device_type, traffic_source, created_at, updated_at, duration_seconds)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW() - INTERVAL '5 minutes', NOW(), $10)
      ON CONFLICT (id) DO UPDATE
      SET updated_at = NOW(), duration_seconds = EXCLUDED.duration_seconds;
    `;
    await client.query(sessionSql, [
      'session_test_1',
      'v_test_ashok',
      '1.2.3.4',
      'India',
      'Hyderabad',
      'Chrome 120',
      'Windows 11',
      'Desktop',
      'LinkedIn',
      315
    ]);
    console.log('✔ Seeded public.visitor_sessions.');

    // 3. Seed page view
    const pageViewSql = `
      INSERT INTO public.page_views (session_id, page_path, page_title, viewed_at)
      VALUES ($1, $2, $3, NOW() - INTERVAL '4 minutes');
    `;
    await client.query(pageViewSql, [
      'session_test_1',
      '/projects',
      'Projects Showcase'
    ]);
    console.log('✔ Seeded public.page_views.');

    console.log('🎉 Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await client.end();
  }
}

seed();
