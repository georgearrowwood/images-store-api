const joi = require('joi')

const validation = {

  rule: joi,

  validateRequest: function (schema) {
    return (req, res, next) => {
      this.validateInput(req, schema)
        // moving forward when it's ok
        .then(next)
        .catch(err => {
          this.handleError(err, res)
        })
    }
  },

  validateInput: function (req, schema) {
    return this.validateParameters(req, schema)
      .then(() => {
        return this.validateQuery(req, schema)
      })
      .then(() => {
        return this.validateBody(req, schema)
      })
  },

  // Show error
  handleError: function (err, res) {
    res.status(400)
      .json({
        message: 'Some parameters are missing or invalid',
        success: false,
        errors: err.errors
      })
  },

  // Validate segment parameters
  validateParameters: function (req, schema) {
    if (!schema || !schema.params) return Promise.resolve()
    return this.validate(req.params, schema.params, 'params')
  },

  // Validate get, query parameters
  validateQuery: function (req, schema) {
    if (!schema || !schema.query) return Promise.resolve()
    return this.validate(req.query, schema.params, 'query')
  },

  // Validate segment parameters
  validateBody: function (req, schema) {
    if (!schema || !schema.body) return Promise.resolve()
    return this.validate(req.body, schema.body, 'body')
  },

  // Validate set of data
  validate (data, schema, type) {
    return new Promise((resolve, reject) => {
      if (schema) {
        let wrappedSchema = Object.assign({}, schema)
        wrappedSchema = joi.object(wrappedSchema).required()
        joi.validate(data, wrappedSchema, (err, value) => {
          if (err) {
            // there are validation errors
            return reject({
              errors: err.details.map(this.mapJoiErrors),
              type: type,
            })
          } else {
            // validation has passed
            return resolve()
          }
        })
      } else {
        return reject({code: 'no-validation-scheme', message: 'No Scheme found for validation.'})
      }
    })
  },

  mapJoiErrors: item => ({
    message: item.message,
    type: item.type,
    field: item.path
  })
}

module.exports = validation
