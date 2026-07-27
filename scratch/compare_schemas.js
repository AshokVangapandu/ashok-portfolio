const fs = require('fs');
const path = require('path');

const devPath = path.join(__dirname, 'schema_dev.json');
const prodPath = path.join(__dirname, 'schema_prod.json');

if (!fs.existsSync(devPath) || !fs.existsSync(prodPath)) {
  console.error('Error: schema_dev.json or schema_prod.json not found. Run extract_schema.js first.');
  process.exit(1);
}

const dev = JSON.parse(fs.readFileSync(devPath, 'utf8'));
const prod = JSON.parse(fs.readFileSync(prodPath, 'utf8'));

const diffs = {
  extensions: { missing: [], differing: [], prodOnly: [] },
  enums: { missing: [], differing: [], prodOnly: [] },
  tables: { missing: [], differing: [], prodOnly: [] },
  views: { missing: [], differing: [], prodOnly: [] },
  columns: { missing: [], differing: [], prodOnly: [] },
  primary_keys: { missing: [], differing: [], prodOnly: [] },
  foreign_keys: { missing: [], differing: [], prodOnly: [] },
  indexes: { missing: [], differing: [], prodOnly: [] },
  constraints: { missing: [], differing: [], prodOnly: [] },
  triggers: { missing: [], differing: [], prodOnly: [] },
  functions: { missing: [], differing: [], prodOnly: [] },
  policies: { missing: [], differing: [], prodOnly: [] },
  storage_buckets: { missing: [], differing: [], prodOnly: [] }
};

// 1. Extensions
const devExts = new Map(dev.extensions.map(e => [e.extname, e.extversion]));
const prodExts = new Map(prod.extensions.map(e => [e.extname, e.extversion]));

for (const [name, version] of devExts) {
  if (!prodExts.has(name)) {
    diffs.extensions.missing.push({ name, version });
  } else if (prodExts.get(name) !== version) {
    diffs.extensions.differing.push({ name, devVersion: version, prodVersion: prodExts.get(name) });
  }
}
for (const [name, version] of prodExts) {
  if (!devExts.has(name)) {
    diffs.extensions.prodOnly.push({ name, version });
  }
}

// 2. Enums
const devEnums = new Map(dev.enums.map(e => [e.typname, e.enum_values]));
const prodEnums = new Map(prod.enums.map(e => [e.typname, e.enum_values]));

for (const [name, values] of devEnums) {
  if (!prodEnums.has(name)) {
    diffs.enums.missing.push({ name, values });
  } else if (prodEnums.get(name) !== values) {
    diffs.enums.differing.push({ name, devValues: values, prodValues: prodEnums.get(name) });
  }
}
for (const [name, values] of prodEnums) {
  if (!devEnums.has(name)) {
    diffs.enums.prodOnly.push({ name, values });
  }
}

// 3. Tables
const devTables = new Map(dev.tables.map(t => [t.table_name, t]));
const prodTables = new Map(prod.tables.map(t => [t.table_name, t]));

for (const [name, t] of devTables) {
  if (!prodTables.has(name)) {
    diffs.tables.missing.push(t);
  } else {
    const pt = prodTables.get(name);
    if (t.rls_enabled !== pt.rls_enabled || t.force_rls !== pt.force_rls) {
      diffs.tables.differing.push({
        table_name: name,
        devRLS: { enabled: t.rls_enabled, force: t.force_rls },
        prodRLS: { enabled: pt.rls_enabled, force: pt.force_rls }
      });
    }
  }
}
for (const [name, t] of prodTables) {
  if (!devTables.has(name)) {
    diffs.tables.prodOnly.push(t);
  }
}

// Helper maps
const getTableColumnKey = (table, col) => `${table}.${col}`;

// 4. Columns
const devCols = new Map(dev.columns.map(c => [getTableColumnKey(c.table_name, c.column_name), c]));
const prodCols = new Map(prod.columns.map(c => [getTableColumnKey(c.table_name, c.column_name), c]));

for (const [key, c] of devCols) {
  if (!devTables.has(c.table_name)) continue; // Table is missing entirely, reported under tables.missing
  if (!prodCols.has(key)) {
    diffs.columns.missing.push(c);
  } else {
    const pc = prodCols.get(key);
    // Compare essential fields
    const diffFields = [];
    if (c.data_type !== pc.data_type) diffFields.push(`data_type (${c.data_type} vs ${pc.data_type})`);
    if (c.is_nullable !== pc.is_nullable) diffFields.push(`is_nullable (${c.is_nullable} vs ${pc.is_nullable})`);
    if (c.column_default !== pc.column_default) diffFields.push(`column_default (${c.column_default} vs ${pc.column_default})`);
    if (c.character_maximum_length !== pc.character_maximum_length) diffFields.push(`character_maximum_length (${c.character_maximum_length} vs ${pc.character_maximum_length})`);
    if (diffFields.length > 0) {
      diffs.columns.differing.push({
        table_name: c.table_name,
        column_name: c.column_name,
        diffs: diffFields
      });
    }
  }
}
for (const [key, c] of prodCols) {
  if (!prodTables.has(c.table_name)) continue; // Table only in prod
  if (!devCols.has(key)) {
    diffs.columns.prodOnly.push(c);
  }
}

// 5. Primary Keys
const devPKs = new Map(dev.primary_keys.map(pk => [getTableColumnKey(pk.table_name, pk.column_name), pk]));
const prodPKs = new Map(prod.primary_keys.map(pk => [getTableColumnKey(pk.table_name, pk.column_name), pk]));

for (const [key, pk] of devPKs) {
  if (!devTables.has(pk.table_name)) continue;
  if (!prodPKs.has(key)) {
    diffs.primary_keys.missing.push(pk);
  }
}
for (const [key, pk] of prodPKs) {
  if (!prodTables.has(pk.table_name)) continue;
  if (!devPKs.has(key)) {
    diffs.primary_keys.prodOnly.push(pk);
  }
}

// Helper for unique key for constraints / FKs
const getFKKey = (fk) => `${fk.table_name}.${fk.column_name}->${fk.foreign_table_name}.${fk.foreign_column_name}`;

// 6. Foreign Keys
const devFKs = new Map(dev.foreign_keys.map(fk => [getFKKey(fk), fk]));
const prodFKs = new Map(prod.foreign_keys.map(fk => [getFKKey(fk), fk]));

for (const [key, fk] of devFKs) {
  if (!devTables.has(fk.table_name)) continue;
  if (!prodFKs.has(key)) {
    diffs.foreign_keys.missing.push(fk);
  } else {
    const pfk = prodFKs.get(key);
    if (fk.update_rule !== pfk.update_rule || fk.delete_rule !== pfk.delete_rule) {
      diffs.foreign_keys.differing.push({
        key,
        devRules: { update: fk.update_rule, delete: fk.delete_rule },
        prodRules: { update: pfk.update_rule, delete: pfk.delete_rule }
      });
    }
  }
}
for (const [key, fk] of prodFKs) {
  if (!prodTables.has(fk.table_name)) continue;
  if (!devFKs.has(key)) {
    diffs.foreign_keys.prodOnly.push(fk);
  }
}

// 7. Indexes
// Note: Compare by table_name + indexname
const getIndexKey = (idx) => `${idx.table_name}.${idx.indexname}`;
const devIdxs = new Map(dev.indexes.map(idx => [getIndexKey(idx), idx]));
const prodIdxs = new Map(prod.indexes.map(idx => [getIndexKey(idx), idx]));

for (const [key, idx] of devIdxs) {
  if (!devTables.has(idx.table_name)) continue;
  if (!prodIdxs.has(key)) {
    diffs.indexes.missing.push(idx);
  } else {
    const pidx = prodIdxs.get(key);
    // Standardize whitespace for comparison
    const cleanDef = (def) => def.replace(/\s+/g, ' ').trim().toLowerCase();
    if (cleanDef(idx.indexdef) !== cleanDef(pidx.indexdef)) {
      diffs.indexes.differing.push({
        table_name: idx.table_name,
        indexname: idx.indexname,
        devDef: idx.indexdef,
        prodDef: pidx.indexdef
      });
    }
  }
}
for (const [key, idx] of prodIdxs) {
  if (!prodTables.has(idx.table_name)) continue;
  if (!devIdxs.has(key)) {
    diffs.indexes.prodOnly.push(idx);
  }
}

// 8. Constraints
const getConstraintKey = (c) => `${c.table_name}.${c.constraint_name}`;
const devConstraints = new Map(dev.constraints.map(c => [getConstraintKey(c), c]));
const prodConstraints = new Map(prod.constraints.map(c => [getConstraintKey(c), c]));

for (const [key, c] of devConstraints) {
  if (!devTables.has(c.table_name)) continue;
  if (!prodConstraints.has(key)) {
    diffs.constraints.missing.push(c);
  } else {
    const pc = prodConstraints.get(key);
    if (c.constraint_def !== pc.constraint_def) {
      diffs.constraints.differing.push({
        table_name: c.table_name,
        constraint_name: c.constraint_name,
        devDef: c.constraint_def,
        prodDef: pc.constraint_def
      });
    }
  }
}
for (const [key, c] of prodConstraints) {
  if (!prodTables.has(c.table_name)) continue;
  if (!devConstraints.has(key)) {
    diffs.constraints.prodOnly.push(c);
  }
}

// 9. Triggers
const getTriggerKey = (t) => `${t.table_name}.${t.trigger_name}`;
const devTriggers = new Map(dev.triggers.map(t => [getTriggerKey(t), t]));
const prodTriggers = new Map(prod.triggers.map(t => [getTriggerKey(t), t]));

for (const [key, t] of devTriggers) {
  if (!devTables.has(t.table_name)) continue;
  if (!prodTriggers.has(key)) {
    diffs.triggers.missing.push(t);
  } else {
    const pt = prodTriggers.get(key);
    const cleanDef = (def) => def.replace(/\s+/g, ' ').trim().toLowerCase();
    if (cleanDef(t.trigger_def) !== cleanDef(pt.trigger_def)) {
      diffs.triggers.differing.push({
        table_name: t.table_name,
        trigger_name: t.trigger_name,
        devDef: t.trigger_def,
        prodDef: pt.trigger_def
      });
    }
  }
}
for (const [key, t] of prodTriggers) {
  if (!prodTables.has(t.table_name)) continue;
  if (!devTriggers.has(key)) {
    diffs.triggers.prodOnly.push(t);
  }
}

// 10. Functions
const devFuncs = new Map(dev.functions.map(f => [f.function_name, f]));
const prodFuncs = new Map(prod.functions.map(f => [f.function_name, f]));

for (const [name, f] of devFuncs) {
  if (!prodFuncs.has(name)) {
    diffs.functions.missing.push(f);
  } else {
    const pf = prodFuncs.get(name);
    const cleanDef = (def) => def.replace(/\s+/g, ' ').trim().toLowerCase();
    if (cleanDef(f.function_def) !== cleanDef(pf.function_def) || f.function_args !== pf.function_args) {
      diffs.functions.differing.push({
        function_name: name,
        devArgs: f.function_args,
        prodArgs: pf.function_args,
        devDef: f.function_def,
        prodDef: pf.function_def
      });
    }
  }
}
for (const [name, f] of prodFuncs) {
  if (!devFuncs.has(name)) {
    diffs.functions.prodOnly.push(f);
  }
}

// 11. Views
const devViews = new Map(dev.views.map(v => [v.view_name, v]));
const prodViews = new Map(prod.views.map(v => [v.view_name, v]));

for (const [name, v] of devViews) {
  if (!prodViews.has(name)) {
    diffs.views.missing.push(v);
  } else {
    const pv = prodViews.get(name);
    const cleanDef = (def) => def.replace(/\s+/g, ' ').trim().toLowerCase();
    if (cleanDef(v.view_definition) !== cleanDef(pv.view_definition) || v.view_options !== pv.view_options) {
      diffs.views.differing.push({
        view_name: name,
        devOptions: v.view_options,
        prodOptions: pv.view_options,
        devDef: v.view_definition,
        prodDef: pv.view_definition
      });
    }
  }
}
for (const [name, v] of prodViews) {
  if (!devViews.has(name)) {
    diffs.views.prodOnly.push(v);
  }
}

// 12. Policies
const getPolicyKey = (p) => `${p.tablename}.${p.policyname}`;
const devPolicies = new Map(dev.policies.map(p => [getPolicyKey(p), p]));
const prodPolicies = new Map(prod.policies.map(p => [getPolicyKey(p), p]));

for (const [key, p] of devPolicies) {
  if (!devTables.has(p.tablename)) continue; // Table is missing
  if (!prodPolicies.has(key)) {
    diffs.policies.missing.push(p);
  } else {
    const pp = prodPolicies.get(key);
    const cleanStr = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const diffsList = [];
    if (p.permissive !== pp.permissive) diffsList.push(`permissive (${p.permissive} vs ${pp.permissive})`);
    if (JSON.stringify(p.roles) !== JSON.stringify(pp.roles)) diffsList.push(`roles (${JSON.stringify(p.roles)} vs ${JSON.stringify(pp.roles)})`);
    if (p.cmd !== pp.cmd) diffsList.push(`cmd (${p.cmd} vs ${pp.cmd})`);
    if (cleanStr(p.qual) !== cleanStr(pp.qual)) diffsList.push(`qual (${p.qual} vs ${pp.qual})`);
    if (cleanStr(p.with_check) !== cleanStr(pp.with_check)) diffsList.push(`with_check (${p.with_check} vs ${pp.with_check})`);
    if (diffsList.length > 0) {
      diffs.policies.differing.push({
        table_name: p.tablename,
        policyname: p.policyname,
        diffs: diffsList,
        devPolicy: p,
        prodPolicy: pp
      });
    }
  }
}
for (const [key, p] of prodPolicies) {
  if (!prodTables.has(p.tablename)) continue;
  if (!devPolicies.has(key)) {
    diffs.policies.prodOnly.push(p);
  }
}

// 13. Storage Buckets
const devBuckets = new Map(dev.storage_buckets.map(b => [b.id, b]));
const prodBuckets = new Map(prod.storage_buckets.map(b => [b.id, b]));

for (const [id, b] of devBuckets) {
  if (!prodBuckets.has(id)) {
    diffs.storage_buckets.missing.push(b);
  } else {
    const pb = prodBuckets.get(id);
    const diffsList = [];
    if (b.public !== pb.public) diffsList.push(`public (${b.public} vs ${pb.public})`);
    if (b.file_size_limit !== pb.file_size_limit) diffsList.push(`file_size_limit (${b.file_size_limit} vs ${pb.file_size_limit})`);
    if (JSON.stringify(b.allowed_mime_types) !== JSON.stringify(pb.allowed_mime_types)) diffsList.push(`allowed_mime_types (${JSON.stringify(b.allowed_mime_types)} vs ${JSON.stringify(pb.allowed_mime_types)})`);
    if (diffsList.length > 0) {
      diffs.storage_buckets.differing.push({
        id,
        name: b.name,
        diffs: diffsList
      });
    }
  }
}
for (const [id, b] of prodBuckets) {
  if (!devBuckets.has(id)) {
    diffs.storage_buckets.prodOnly.push(b);
  }
}

// Write comparison report to JSON for easy parsing or viewing
fs.writeFileSync(path.join(__dirname, 'schema_diff.json'), JSON.stringify(diffs, null, 2), 'utf8');

// Also print summary
console.log('\n=== COMPONENT COMPARISON SUMMARY ===');
for (const [key, obj] of Object.entries(diffs)) {
  const m = obj.missing.length;
  const d = obj.differing.length;
  const p = obj.prodOnly.length;
  if (m > 0 || d > 0 || p > 0) {
    console.log(`${key.toUpperCase()}: ${m} missing on prod, ${d} differing, ${p} prod-only`);
  } else {
    console.log(`${key.toUpperCase()}: In sync`);
  }
}
