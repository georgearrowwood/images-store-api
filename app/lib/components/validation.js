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
    return this.validateSchema(req.params, schema.params, 'params')
      .then(() => {
        return this.validateSchema(req.query, schema.query, 'query')
      })
      .then(() => {
        return this.validateSchema(req.body, schema.body, 'body')
      })
      .then(() => {
        return this.validateSchema(req.files, schema.files, 'files')
      })
  },

  // Show error
  handleError: function (err, res) {
    res.status(400)
      .json({
        message: 'Some parameters are missing or invalid',
        success: false,
        errors: {
          errors: err.errors,
          type: err.type
        }
      })
  },

  // Validate segment parameters
  validateSchema: function (data, schema, type) {
    if (typeof data === 'undefined') data = {}
    if (!schema) return Promise.resolve()
    return this.validate(data, schema, type)
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
