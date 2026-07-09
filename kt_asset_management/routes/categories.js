const express = require('express');
const { AssetCategory } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  const categories = await AssetCategory.findAll({ order: [['name', 'ASC']] });
  res.render('categories/index', { title: 'Asset Categories', categories });
});

router.get('/new', (req, res) => {
  res.render('categories/form', {
    title: 'New Asset Category',
    category: {},
    errors: [],
  });
});

router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    await AssetCategory.create({ name, description });
    res.redirect('/categories');
  } catch (err) {
    res.render('categories/form', {
      title: 'New Asset Category',
      category: req.body,
      errors: [err.errors ? err.errors.map((e) => e.message).join(', ') : err.message],
    });
  }
});

router.get('/:id/edit', async (req, res) => {
  const category = await AssetCategory.findByPk(req.params.id);
  if (!category) return res.status(404).render('errors/404', { title: 'Not found' });
  res.render('categories/form', { title: 'Edit Asset Category', category, errors: [] });
});

router.put('/:id', async (req, res) => {
  const category = await AssetCategory.findByPk(req.params.id);
  if (!category) return res.status(404).render('errors/404', { title: 'Not found' });

  const { name, description } = req.body;
  try {
    await category.update({ name, description });
    res.redirect('/categories');
  } catch (err) {
    res.render('categories/form', {
      title: 'Edit Asset Category',
      category: { ...category.toJSON(), name, description },
      errors: [err.errors ? err.errors.map((e) => e.message).join(', ') : err.message],
    });
  }
});

router.delete('/:id', async (req, res) => {
  const category = await AssetCategory.findByPk(req.params.id);
  if (category) await category.destroy();
  res.redirect('/categories');
});

module.exports = router;
