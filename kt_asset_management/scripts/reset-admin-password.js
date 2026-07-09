#!/usr/bin/env node
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { User, sequelize } = require('../models');

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user, created] = await User.findOrCreate({
    where: { username },
    defaults: { passwordHash },
  });

  if (!created) {
    await user.update({ passwordHash });
  }

  console.log(`✔ admin user "${username}" password ${created ? 'created' : 'reset'} to match .env`);
  await sequelize.close();
}

main().catch((err) => {
  console.error('Reset failed:', err.message);
  process.exit(1);
});
