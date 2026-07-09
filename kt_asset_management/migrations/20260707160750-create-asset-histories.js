module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('asset_histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      asset_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'assets', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'employees', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      action: {
        type: Sequelize.ENUM('purchase', 'issue', 'return', 'scrap'),
        allowNull: false,
      },
      reason: {
        type: Sequelize.ENUM('upgrade', 'repair', 'resignation', 'other'),
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      action_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('asset_histories');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_asset_histories_action";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_asset_histories_reason";');
  },
};
