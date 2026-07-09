module.exports = (sequelize, DataTypes) => {
  const AssetCategory = sequelize.define('AssetCategory', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'asset_categories',
    underscored: true,
  });

  AssetCategory.associate = (models) => {
    AssetCategory.hasMany(models.Asset, { foreignKey: 'categoryId' });
  };

  return AssetCategory;
};
