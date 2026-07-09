const express = require('express');
const { Employee } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  const employees = await Employee.findAll({ order: [['name', 'ASC']] });
  res.render('employees/index', { title: 'Employees', employees });
});

router.get('/new', (req, res) => {
  res.render('employees/form', {
    title: 'New Employee',
    employee: { isActive: true },
    errors: [],
  });
});

router.post('/', async (req, res) => {
  const { employeeCode, name, department, branch } = req.body;
  const email = req.body.email || null;
  const isActive = req.body.isActive === 'on';
  try {
    await Employee.create({ employeeCode, name, email, department, branch, isActive });
    res.redirect('/employees');
  } catch (err) {
    res.render('employees/form', {
      title: 'New Employee',
      employee: { ...req.body, isActive },
      errors: [err.errors ? err.errors.map((e) => e.message).join(', ') : err.message],
    });
  }
});

router.get('/:id', async (req, res) => {
  const employee = await Employee.findByPk(req.params.id);
  if (!employee) return res.status(404).render('errors/404', { title: 'Not found' });
  res.render('employees/view', { title: employee.name, employee });
});

router.get('/:id/edit', async (req, res) => {
  const employee = await Employee.findByPk(req.params.id);
  if (!employee) return res.status(404).render('errors/404', { title: 'Not found' });
  res.render('employees/form', { title: 'Edit Employee', employee, errors: [] });
});

router.put('/:id', async (req, res) => {
  const employee = await Employee.findByPk(req.params.id);
  if (!employee) return res.status(404).render('errors/404', { title: 'Not found' });

  const { employeeCode, name, department, branch } = req.body;
  const email = req.body.email || null;
  const isActive = req.body.isActive === 'on';
  try {
    await employee.update({ employeeCode, name, email, department, branch, isActive });
    res.redirect('/employees');
  } catch (err) {
    res.render('employees/form', {
      title: 'Edit Employee',
      employee: { ...employee.toJSON(), employeeCode, name, email, department, branch, isActive },
      errors: [err.errors ? err.errors.map((e) => e.message).join(', ') : err.message],
    });
  }
});

module.exports = router;
