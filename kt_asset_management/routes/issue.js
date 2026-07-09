const express = require('express');
const { Asset, AssetCategory, Employee, AssetHistory, sequelize } = require('../models');

const router = express.Router();

async function loadOptions() {
  const [assets, employees] = await Promise.all([
    Asset.scope('inStock').findAll({ include: [AssetCategory], order: [['assetCode', 'ASC']] }),
    Employee.findAll({ where: { isActive: true }, order: [['name', 'ASC']] }),
  ]);
  return { assets, employees };
}

router.get('/', async (req, res) => {
  const { assets, employees } = await loadOptions();
  res.render('issue/form', {
    title: 'Issue Asset',
    assets,
    employees,
    selectedAssetId: req.query.assetId || '',
    errors: [],
  });
});

router.post('/', async (req, res) => {
  const { assetId, employeeId, notes } = req.body;
  const errors = [];

  const asset = await Asset.scope('inStock').findByPk(assetId);
  if (!asset) errors.push('That asset is no longer available in stock.');

  const employee = await Employee.findOne({ where: { id: employeeId, isActive: true } });
  if (!employee) errors.push('That employee is not active.');

  if (errors.length) {
    const { assets, employees } = await loadOptions();
    return res.render('issue/form', {
      title: 'Issue Asset',
      assets,
      employees,
      selectedAssetId: assetId,
      errors,
    });
  }

  await sequelize.transaction(async (t) => {
    await asset.update({ status: 'issued', currentEmployeeId: employee.id }, { transaction: t });
    await AssetHistory.create({
      assetId: asset.id,
      employeeId: employee.id,
      action: 'issue',
      notes: notes || null,
    }, { transaction: t });
  });

  res.redirect(`/assets/${asset.id}`);
});

module.exports = router;
