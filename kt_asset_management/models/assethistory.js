module.exports = (sequelize, DataTypes) => {
  const AssetHistory = sequelize.define('AssetHistory', {
    assetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    action: {
      type: DataTypes.ENUM('purchase', 'issue', 'return', 'scrap'),
      allowNull: false,
    },
    reason: {
      type: DataTypes.ENUM('upgrade', 'repair', 'resignation', 'other'),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    actionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'asset_histories',
    underscored: true,
    updatedAt: false,
  });

  AssetHistory.associate = (models) => {
    AssetHistory.belongsTo(models.Asset, { foreignKey: 'assetId' });
    AssetHistory.belongsTo(models.Employee, { foreignKey: 'employeeId' });
  };

  return AssetHistory;
};
