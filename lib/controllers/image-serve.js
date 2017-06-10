'use strict'

module.exports.profile = function (req, res) {
  if (!req.user) return res.redirect('/login');
  res.render('profile', {
    user: req.user
  })
}
