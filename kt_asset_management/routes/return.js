const express = require('express');
const { Asset, AssetCategory, Employee, AssetHistory, sequelize } = require('../models');

const router = express.Router();

const REASONS = ['upgrade', 'repair', 'resignation', 'other'];

async function loadOptions() {
  return Asset.scope('issued').findAll({
    include: [AssetCategory, { model: Employee, as: 'currentHolder' }],
    order: [['assetCode', 'ASC']],
  });
}

router.get('/', async (req, res) => {
  const assets = await loadOptions();
  res.render('return/form', {
    title: 'Return Asset',
    assets,
    reasons: REASONS,
    selectedAssetId: req.query.assetId || '',
    errors: [],
  });
});

router.post('/', async (req, res) => {
  const { assetId, reason, notes } = req.body;
  const errors = [];

  const asset = await Asset.scope('issued').findByPk(assetId, { include: [{ model: Employee, as: 'currentHolder' }] });
  if (!asset) errors.push('That asset is not currently issued to anyone.');
  if (!REASONS.includes(reason)) errors.push('Please select a valid reason for return.');

  if (errors.length) {
    const assets = await loadOptions();
    return res.render('return/form', {
      title: 'Return Asset',
      assets,
      reasons: REASONS,
      selectedAssetId: assetId,
      errors,
    });
  }

  const returningEmployeeId = asset.currentEmployeeId;

  await sequelize.transaction(async (t) => {
    await asset.update({ status: 'in_stock', currentEmployeeId: null }, { transaction: t });
    await AssetHistory.create({
      assetId: asset.id,
      employeeId: returningEmployeeId,
      action: 'return',
      reason,
      notes: notes || null,
    }, { transaction: t });
  });

  res.redirect(`/assets/${asset.id}`);
});

module.exports = router;
