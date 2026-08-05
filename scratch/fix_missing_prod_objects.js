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

const sqlQueries = [
  // 1. Add invitation_accepted_at column to admins table
  `ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS invitation_accepted_at TIMESTAMPTZ;`,
  
  // 2. Create update policy on admins table
  `DROP POLICY IF EXISTS "Allow users to update their own admin record" ON public.admins;`,
  `CREATE POLICY "Allow users to update their own admin record"
     ON public.admins FOR UPDATE TO authenticated
     USING (email = (SELECT auth.jwt() ->> 'email'))
     WITH CHECK (email = (SELECT auth.jwt() ->> 'email'));`,
     
  // 3. Create protect_admin_roles() function
  `CREATE OR REPLACE FUNCTION public.protect_admin_roles()
   RETURNS TRIGGER AS $$
   BEGIN
     IF (OLD.role IS DISTINCT FROM NEW.role OR 
         OLD.permissions IS DISTINCT FROM NEW.permissions OR 
         OLD.is_active IS DISTINCT FROM NEW.is_active) THEN
       IF NOT EXISTS (
         SELECT 1 FROM public.admins
         WHERE email = (SELECT auth.jwt() ->> 'email')
         AND role = 'super_admin'
         AND is_active = true
       ) THEN
         RAISE EXCEPTION 'Only active Super Admins can modify admin roles, permissions, or active status.';
       END IF;
     END IF;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;`,
   
  // 4. Create tr_protect_admin_roles trigger on admins table
  `DROP TRIGGER IF EXISTS tr_protect_admin_roles ON public.admins;`,
  `CREATE TRIGGER tr_protect_admin_roles
     BEFORE UPDATE ON public.admins
     FOR EACH ROW EXECUTE FUNCTION public.protect_admin_roles();`
];

async function main() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Production database...');
    await client.connect();
    console.log('Connected successfully.');

    console.log('Running DDL statements to fix missing objects...');
    for (const sql of sqlQueries) {
      await client.query(sql);
    }
    console.log('✅ Successfully applied all missing schema elements to Production database!');

  } catch (err) {
    console.error('❌ Failed to run query:', err);
  } finally {
    await client.end();
  }
}

main();
