'use strict'

var jwt = require('jsonwebtoken')

const jwtAuth = {

  checkScope: function (scope) {
    return (req, res, next) => {
      if (!req.headers.authorization) return this.handleError(res)
      const decoded = jwt.decode(req.headers.authorization)
      if (scope === decoded.scope) {
        next()
      } else {
        return this.handleError(res)
      }
    }
  },

  // Show error
  handleError: function (res) {
    res.status(401)
      .json({
        success: false
      })
  }
}

module.exports = jwtAuth
