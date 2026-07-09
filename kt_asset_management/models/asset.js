const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define('Asset', {
    assetCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    serialNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    purchaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    purchaseValue: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('in_stock', 'issued', 'scrapped'),
      allowNull: false,
      defaultValue: 'in_stock',
    },
    currentEmployeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    photoPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'assets',
    underscored: true,
    defaultScope: {
      where: { status: { [Op.ne]: 'scrapped' } },
    },
    scopes: {
      all: {},
      inStock: { where: { status: 'in_stock' } },
      issued: { where: { status: 'issued' } },
      scrapped: { where: { status: 'scrapped' } },
    },
  });

  Asset.associate = (models) => {
    Asset.belongsTo(models.AssetCategory, { foreignKey: 'categoryId' });
    Asset.belongsTo(models.Employee, { as: 'currentHolder', foreignKey: 'currentEmployeeId' });
    Asset.hasMany(models.AssetHistory, { foreignKey: 'assetId' });
  };

  return Asset;
};
