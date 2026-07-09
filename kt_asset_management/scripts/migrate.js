#!/usr/bin/env node
const { execSync } = require('child_process');
const db = require('../models');

async function tableNames(queryInterface) {
  const tables = await queryInterface.showAllTables();
  return new Set(tables.map((t) => (typeof t === 'string' ? t : t.tableName)));
}

async function main() {
  const qi = db.sequelize.getQueryInterface();
  const before = await tableNames(qi);

  execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });

  const after = await tableNames(qi);

  for (const modelName of Object.keys(db)) {
    const model = db[modelName];
    if (!model || !model.getTableName) continue;
    const table = model.getTableName();
    if (!after.has(table)) {
      console.log(`${table} (MISSING — no migration created it)`);
    } else if (before.has(table)) {
      console.log(`${table} (already exists, skipped)`);
    } else {
      console.log(`${table} (created)`);
    }
  }

  await db.sequelize.close();
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
