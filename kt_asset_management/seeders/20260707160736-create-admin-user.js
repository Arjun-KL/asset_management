require('dotenv').config();
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    const passwordHash = await bcrypt.hash(password, 10);

    const [existing] = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE username = :username',
      { replacements: { username } }
    );
    if (existing.length) return;

    await queryInterface.bulkInsert('users', [{
      username,
      password_hash: passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    }]);
  },
  down: async (queryInterface) => {
    const username = process.env.ADMIN_USERNAME;
    await queryInterface.bulkDelete('users', { username });
  },
};
