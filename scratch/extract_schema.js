const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ENV_PATH = path.join(__dirname, '..', '.env');
const DEV_REF = 'xpuhbtsgwhgbcvmwzlyd';
const PROD_REF = 'txoszrnjkrlbjzpjisvp';

// Read access token from .env
let token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token && fs.existsSync(ENV_PATH)) {
  const envContent = fs.readFileSync(ENV_PATH, 'utf8');
  const match = envContent.match(/SUPABASE_ACCESS_TOKEN=(.*)/);
  if (match) {
    token = match[1].trim();
  }
}

if (!token) {
  console.error('Error: SUPABASE_ACCESS_TOKEN not found in environment or .env file.');
  process.exit(1);
}

// Queries definition
const QUERIES = {
  extensions: `
    SELECT extname, extversion 
    FROM pg_extension
    ORDER BY extname;
  `,
  enums: `
    SELECT t.typname, string_agg(e.enumlabel, ',' ORDER BY e.enumsortorder) AS enum_values
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
    GROUP BY t.typname
    ORDER BY t.typname;
  `,
  tables: `
    SELECT 
        c.relname AS table_name,
        c.relrowsecurity AS rls_enabled,
        c.relforcerowsecurity AS force_rls
    FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public' AND c.relkind = 'r'
    ORDER BY table_name;
  `,
  columns: `
    SELECT 
        table_name, 
        column_name, 
        data_type, 
        is_nullable, 
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position;
  `,
  primary_keys: `
    SELECT kcu.table_name, kcu.column_name, tc.constraint_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_schema = 'public'
    ORDER BY kcu.table_name, kcu.column_name;
  `,
  foreign_keys: `
    SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        rc.update_rule,
        rc.delete_rule,
        tc.constraint_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.referential_constraints rc
      ON tc.constraint_name = rc.constraint_name
    JOIN information_schema.constraint_column_usage ccu
      ON rc.unique_constraint_name = ccu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
    ORDER BY tc.table_name, kcu.column_name;
  `,
  indexes: `
    SELECT
        tablename as table_name,
        indexname,
        indexdef
    FROM pg_indexes
    WHERE schemaname = 'public'
    ORDER BY tablename, indexname;
  `,
  constraints: `
    SELECT
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type,
        pg_get_constraintdef(c.oid) as constraint_def
    FROM information_schema.table_constraints tc
    JOIN pg_constraint c ON c.conname = tc.constraint_name
    JOIN pg_namespace n ON n.oid = connamespace
    WHERE tc.table_schema = 'public' AND tc.constraint_type NOT IN ('PRIMARY KEY', 'FOREIGN KEY')
    ORDER BY tc.table_name, tc.constraint_name;
  `,
  triggers: `
    SELECT
        t.tgname AS trigger_name,
        rel.relname AS table_name,
        pg_get_triggerdef(t.oid) AS trigger_def
    FROM pg_trigger t
    JOIN pg_class rel ON t.tgrelid = rel.oid
    JOIN pg_namespace nsp ON rel.relnamespace = nsp.oid
    WHERE nsp.nspname = 'public' AND NOT t.tgisinternal;
  `,
  functions: `
    SELECT
        p.proname AS function_name,
        pg_get_functiondef(p.oid) AS function_def,
        pg_get_function_arguments(p.oid) AS function_args,
        n.nspname AS schema_name
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.prokind = 'f'
    ORDER BY function_name;
  `,
  views: `
    SELECT
        c.relname AS view_name,
        pg_get_viewdef(c.oid) AS view_definition,
        array_to_string(c.reloptions, ', ') AS view_options
    FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public' AND c.relkind = 'v'
    ORDER BY view_name;
  `,
  policies: `
    SELECT
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname;
  `,
  storage_buckets: `
    SELECT id, name, public, file_size_limit, allowed_mime_types
    FROM storage.buckets
    ORDER BY id;
  `
};

function linkProject(ref) {
  console.log(`Linking project ${ref}...`);
  const cmd = `npx supabase link --project-ref ${ref}`;
  execSync(cmd, {
    env: { ...process.env, SUPABASE_ACCESS_TOKEN: token },
    stdio: 'inherit'
  });
}

function runQuery(sql) {
  const tmpFile = path.join(__dirname, 'temp_query.sql');
  fs.writeFileSync(tmpFile, sql, 'utf8');

  try {
    const cmd = `npx supabase db query --linked --output-format json -f "${tmpFile}"`;
    const stdout = execSync(cmd, {
      env: { ...process.env, SUPABASE_ACCESS_TOKEN: token },
      maxBuffer: 10 * 1024 * 1024
    }).toString();

    // Parse out JSON
    const startIndex = stdout.indexOf('{');
    const endIndex = stdout.lastIndexOf('}');
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('No JSON output found in query response');
    }
    const jsonStr = stdout.substring(startIndex, endIndex + 1);
    const parsed = JSON.parse(jsonStr);
    return parsed.rows || [];
  } finally {
    if (fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
  }
}

function extractSchema(ref, outFile) {
  console.log(`\n=== Extracting schema for ${ref} ===`);
  linkProject(ref);

  const schema = {};
  for (const [key, sql] of Object.entries(QUERIES)) {
    console.log(`Running query for ${key}...`);
    try {
      schema[key] = runQuery(sql);
    } catch (err) {
      console.error(`Failed to query ${key}:`, err.message);
      schema[key] = [];
    }
  }

  fs.writeFileSync(outFile, JSON.stringify(schema, null, 2), 'utf8');
  console.log(`Schema saved to ${outFile}`);
  return schema;
}

// Extract both
const devSchema = extractSchema(DEV_REF, path.join(__dirname, 'schema_dev.json'));
const prodSchema = extractSchema(PROD_REF, path.join(__dirname, 'schema_prod.json'));

console.log('\nExtraction complete. Ready for comparison.');
