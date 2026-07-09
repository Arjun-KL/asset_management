const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const { Asset, AssetCategory, Employee, AssetHistory, sequelize } = require('../models');
const upload = require('../middleware/upload');

const router = express.Router();

async function loadFormOptions() {
  const categories = await AssetCategory.findAll({ order: [['name', 'ASC']] });
  return { categories };
}

function removeUploadedFile(file) {
  if (!file) return;
  fs.unlink(path.join(__dirname, '..', 'public', 'uploads', 'assets', file.filename), () => {});
}

function uploadPhoto(req, res, next) {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      req.uploadError = err.code === 'LIMIT_FILE_SIZE'
        ? 'Photo must be smaller than 5MB.'
        : err.message;
    }
    next();
  });
}

router.get('/', async (req, res) => {
  const [assets, categories] = await Promise.all([
    Asset.findAll({
      include: [AssetCategory, { model: Employee, as: 'currentHolder' }],
      order: [['assetCode', 'ASC']],
    }),
    AssetCategory.findAll({ order: [['name', 'ASC']] }),
  ]);
  res.render('assets/index', { title: 'Assets', assets, categories });
});

router.get('/new', async (req, res) => {
  const { categories } = await loadFormOptions();
  res.render('assets/form', {
    title: 'New Asset',
    asset: { status: 'in_stock' },
    categories,
    errors: [],
  });
});

router.post('/', uploadPhoto, async (req, res) => {
  const { assetCode, serialNumber, categoryId, make, model, purchaseDate, purchaseValue, branch } = req.body;
  if (req.uploadError) {
    const { categories } = await loadFormOptions();
    return res.render('assets/form', {
      title: 'New Asset',
      asset: req.body,
      categories,
      errors: [req.uploadError],
    });
  }
  try {
    await sequelize.transaction(async (t) => {
      const asset = await Asset.create({
        assetCode,
        serialNumber,
        categoryId,
        make,
        model,
        purchaseDate,
        purchaseValue,
        branch,
        photoPath: req.file ? `/uploads/assets/${req.file.filename}` : null,
      }, { transaction: t });
      await AssetHistory.create({
        assetId: asset.id,
        action: 'purchase',
        actionDate: purchaseDate,
      }, { transaction: t });
    });
    res.redirect('/assets');
  } catch (err) {
    removeUploadedFile(req.file);
    const { categories } = await loadFormOptions();
    res.render('assets/form', {
      title: 'New Asset',
      asset: req.body,
      categories,
      errors: [err.errors ? err.errors.map((e) => e.message).join(', ') : err.message],
    });
  }
});

router.get('/:id', async (req, res) => {
  const asset = await Asset.scope('all').findByPk(req.params.id, {
    include: [AssetCategory, { model: Employee, as: 'currentHolder' }],
  });
  if (!asset) return res.status(404).render('errors/404', { title: 'Not found' });
  res.render('assets/view', { title: asset.assetCode, asset });
});

router.get('/:id/history', async (req, res) => {
  const asset = await Asset.scope('all').findByPk(req.params.id, { include: [AssetCategory] });
  if (!asset) return res.status(404).render('errors/404', { title: 'Not found' });

  const history = await AssetHistory.findAll({
    where: { assetId: asset.id },
    include: [Employee],
    order: [['actionDate', 'ASC']],
  });

  res.render('assets/history', { title: `${asset.assetCode} — History`, asset, history });
});

router.get('/:id/edit', async (req, res) => {
  const asset = await Asset.scope('all').findByPk(req.params.id);
  if (!asset) return res.status(404).render('errors/404', { title: 'Not found' });
  const { categories } = await loadFormOptions();
  res.render('assets/form', { title: 'Edit Asset', asset, categories, errors: [] });
});

router.put('/:id', uploadPhoto, async (req, res) => {
  const asset = await Asset.scope('all').findByPk(req.params.id);
  if (!asset) return res.status(404).render('errors/404', { title: 'Not found' });

  const { assetCode, serialNumber, categoryId, make, model, purchaseDate, purchaseValue, branch } = req.body;
  if (req.uploadError) {
    const { categories } = await loadFormOptions();
    return res.render('assets/form', {
      title: 'Edit Asset',
      asset: { ...asset.toJSON(), ...req.body },
      categories,
      errors: [req.uploadError],
    });
  }
  try {
    const updates = { assetCode, serialNumber, categoryId, make, model, purchaseDate, purchaseValue, branch };
    if (req.file) {
      const previousPhoto = asset.photoPath;
      updates.photoPath = `/uploads/assets/${req.file.filename}`;
      if (previousPhoto) {
        fs.unlink(path.join(__dirname, '..', 'public', previousPhoto), () => {});
      }
    }
    await asset.update(updates);
    res.redirect(`/assets/${asset.id}`);
  } catch (err) {
    removeUploadedFile(req.file);
    const { categories } = await loadFormOptions();
    res.render('assets/form', {
      title: 'Edit Asset',
      asset: { ...asset.toJSON(), ...req.body },
      categories,
      errors: [err.errors ? err.errors.map((e) => e.message).join(', ') : err.message],
    });
  }
});

module.exports = router;
