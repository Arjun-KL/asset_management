module.exports = function ensureAuth(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  return res.redirect('/login');
};
