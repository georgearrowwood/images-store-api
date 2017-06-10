'use strict'

var jwt = require('jsonwebtoken');

const credentials = require('../config').auth.credentials

module.exports.login = function (req, res) {

  if (req.body.username === credentials.username && req.body.password === credentials.password) {
    const tokenData = {
      username: req.body.username,
      scope: 'admin'
    };
    res.json({
      username: req.body.username,
      token: jwt.sign(tokenData, require('../config').auth.privateKey),
      success: true
    })
  } else {
    res.status(401)
      .json({
        message: 'Authentication information is missing or invalid',
        success: false
      })
  }
}
