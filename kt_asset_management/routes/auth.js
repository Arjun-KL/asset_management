const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const router = express.Router();

router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('auth/login', { title: 'Log in', errors: [] });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.info(`Login attempt for username: ${username}`);
  const user = await User.findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    console.warn(`Failed login attempt for username: ${username}`);
    return res.render('auth/login', {
      title: 'Log in',
      errors: ['Invalid username or password.'],
    });
  }

  req.session.userId = user.id;
  res.redirect('/');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
