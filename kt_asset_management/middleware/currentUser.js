const { User } = require('../models');

module.exports = async function currentUser(req, res, next) {
  if (req.session.userId) {
    res.locals.user = await User.findByPk(req.session.userId);
  } else {
    res.locals.user = null;
  }
  next();
};
