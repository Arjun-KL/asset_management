const express = require('express');
const { Asset } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  const assets = await Asset.scope('inStock').findAll({
    attributes: ['branch', 'purchaseValue'],
  });

  const byBranch = {};
  for (const asset of assets) {
    if (!byBranch[asset.branch]) {
      byBranch[asset.branch] = { branch: asset.branch, count: 0, totalValue: 0 };
    }
    byBranch[asset.branch].count += 1;
    byBranch[asset.branch].totalValue += Number(asset.purchaseValue);
  }

  const branches = Object.values(byBranch).sort((a, b) => a.branch.localeCompare(b.branch));
  const grandTotal = {
    count: assets.length,
    totalValue: branches.reduce((sum, b) => sum + b.totalValue, 0),
  };

  res.render('stock/index', { title: 'Stock View', branches, grandTotal });
});

module.exports = router;
