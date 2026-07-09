module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    employeeCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'employees',
    underscored: true,
  });

  Employee.associate = (models) => {
    Employee.hasMany(models.Asset, { as: 'assets', foreignKey: 'currentEmployeeId' });
  };

  return Employee;
};
