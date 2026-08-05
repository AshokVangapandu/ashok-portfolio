const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const ENV_PATH = path.join(__dirname, '..', '.env');
const DEV_REF = 'xpuhbtsgwhgbcvmwzlyd';
const PROD_REF = 'txoszrnjkrlbjzpjisvp';

// Read password from .env
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

// Queries definition (adapted from extract_schema.js)
const QUERIES = {
  migrations: `
    SELECT version 
    FROM supabase_migrations.schema_migrations
    ORDER BY version;
  `,
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

async function fetchSchema(ref, name) {
  console.log(`Extracting schema for ${name} (${ref})...`);
  const connectionString = `postgresql://postgres.${ref}:${encodeURIComponent(dbPassword)}@aws-1-ap-south-1.pooler.supabase.com:5432/postgres`;
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  const schema = {};
  
  for (const [key, sql] of Object.entries(QUERIES)) {
    try {
      const res = await client.query(sql);
      schema[key] = res.rows;
    } catch (err) {
      console.error(`  Failed to query ${key}:`, err.message);
      schema[key] = [];
    }
  }

  await client.end();
  const filePath = path.join(__dirname, `schema_${name.toLowerCase()}.json`);
  fs.writeFileSync(filePath, JSON.stringify(schema, null, 2), 'utf8');
  console.log(`  Saved schema to ${filePath}`);
  return schema;
}

async function run() {
  const dev = await fetchSchema(DEV_REF, 'DEV');
  const prod = await fetchSchema(PROD_REF, 'PROD');

  console.log('\n====================================================');
  console.log('AUDITING APPLIED MIGRATIONS');
  console.log('====================================================');
  
  const devMig = new Set(dev.migrations.map(m => m.version));
  const prodMig = new Set(prod.migrations.map(m => m.version));

  const missingInProd = [...devMig].filter(m => !prodMig.has(m));
  const missingInDev = [...prodMig].filter(m => !devMig.has(m));

  if (missingInProd.length > 0) {
    console.log(`❌ Production is missing ${missingInProd.length} migration versions:`, missingInProd);
  } else {
    console.log(`✅ All migration versions in DEV (${devMig.size}) are marked as applied in PROD (${prodMig.size}).`);
  }

  if (missingInDev.length > 0) {
    console.log(`⚠️ DEV is missing migration versions applied in PROD:`, missingInDev);
  }

  console.log('\n====================================================');
  console.log('AUDITING SCHEMA OBJECTS');
  console.log('====================================================');

  const auditCategory = (title, devList, prodList, keyFn, descFn) => {
    const prodMap = new Map(prodList.map(item => [keyFn(item), item]));
    const missing = [];
    
    for (const devItem of devList) {
      const key = keyFn(devItem);
      if (!prodMap.has(key)) {
        missing.push(descFn(devItem));
      }
    }
    
    if (missing.length > 0) {
      console.log(`❌ Missing ${title} in Production (${missing.length}):`);
      missing.forEach(m => console.log(`   - ${m}`));
    } else {
      console.log(`✅ ${title}: In Sync`);
    }
  };

  // Tables
  auditCategory(
    'Tables',
    dev.tables,
    prod.tables,
    t => t.table_name,
    t => t.table_name
  );

  // Columns
  auditCategory(
    'Columns',
    dev.columns,
    prod.columns,
    c => `${c.table_name}.${c.column_name}`,
    c => `${c.table_name}.${c.column_name} (${c.data_type})`
  );

  // Indexes
  auditCategory(
    'Indexes',
    dev.indexes,
    prod.indexes,
    i => `${i.table_name}.${i.indexname}`,
    i => `${i.table_name}.${i.indexname}`
  );

  // Triggers
  auditCategory(
    'Triggers',
    dev.triggers,
    prod.triggers,
    t => `${t.table_name}.${t.trigger_name}`,
    t => `${t.table_name}.${t.trigger_name}`
  );

  // Functions
  auditCategory(
    'Functions',
    dev.functions,
    prod.functions,
    f => f.function_name,
    f => `${f.function_name}(${f.function_args || ''})`
  );

  // Policies
  auditCategory(
    'RLS Policies',
    dev.policies,
    prod.policies,
    p => `${p.tablename}.${p.policyname}`,
    p => `${p.tablename}.${p.policyname} (cmd: ${p.cmd})`
  );

  // Views
  auditCategory(
    'Views',
    dev.views,
    prod.views,
    v => v.view_name,
    v => v.view_name
  );
}

run().catch(console.error);
