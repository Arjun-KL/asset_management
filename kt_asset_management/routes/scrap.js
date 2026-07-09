const express = require('express');
const { Asset, AssetCategory, Employee, AssetHistory, sequelize } = require('../models');

const router = express.Router();

async function loadOptions() {
  return Asset.scope('all').findAll({
    where: { status: ['in_stock', 'issued'] },
    include: [AssetCategory, { model: Employee, as: 'currentHolder' }],
    order: [['assetCode', 'ASC']],
  });
}

router.get('/', async (req, res) => {
  const assets = await loadOptions();
  res.render('scrap/form', {
    title: 'Scrap Asset',
    assets,
    selectedAssetId: req.query.assetId || '',
    errors: [],
  });
});

router.post('/', async (req, res) => {
  const { assetId, notes } = req.body;

  const asset = await Asset.scope('all').findOne({ where: { id: assetId, status: ['in_stock', 'issued'] } });
  if (!asset) {
    const assets = await loadOptions();
    return res.render('scrap/form', {
      title: 'Scrap Asset',
      assets,
      selectedAssetId: assetId,
      errors: ['That asset cannot be scrapped (it may already be scrapped).'],
    });
  }

  await sequelize.transaction(async (t) => {
    await AssetHistory.create({
      assetId: asset.id,
      employeeId: asset.currentEmployeeId,
      action: 'scrap',
      notes: notes || null,
    }, { transaction: t });
    await asset.update({ status: 'scrapped' }, { transaction: t });
  });

  res.redirect(`/assets/${asset.id}`);
});

module.exports = router;
