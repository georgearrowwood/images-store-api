'use strict'

var sharp = require('sharp')

const ImageModel = require('../models/image')

module.exports.list = function (req, res, next) {
  const query = ImageModel.find()
    .select('id name createdAt')

  if (req.query.limit) query.limit(parseInt(req.query.limit))
  if (req.query.offset) query.skip(parseInt(req.query.offset))

  query.exec((err, images) => {
    if (err) return next(err)
    const responseObject = {
      images: images.length ? images.map(item => ({id: item.id, name: item.name, createdAt: item.createdAt})) : null,
      success: true
    }
    if (req.query.limit) responseObject.limit = parseInt(req.query.limit)
    if (req.query.offset) responseObject.offset = parseInt(req.query.offset)
    res.json(responseObject)
  })
}

module.exports.getOne = function (req, res, next) {
  ImageModel.findOne({id: req.params.id})
    .select('id name createdAt')
    .exec((err, image) => {
      if (err) return next(err)
      if (!image) {
        res.status(404).json({
          message: 'Image object not found',
          success: false
        })
      } else {
        res.json({
          image: {
            id: image.id,
            name: image.name,
            createdAt: image.createdAt
          },
          success: true
        })
      }
    })
}

module.exports.renderOneImage = function (req, res, next) {
  ImageModel.findOne({id: req.params.id})
    .exec((err, image) => {
      if (err) return next(err)
      if (!image) {
        res.status(404).json({
          message: 'Image object not found',
          success: false
        })
      } else {
        res.contentType(image.data.contentType)
          .send(image.data.data)
      }
    })
}

module.exports.resizeOneImage = function (req, res, next) {
  ImageModel.findOne({id: req.params.id})
    .exec((err, image) => {
      if (err) return next(err)
      if (!image) {
        res.status(404).json({
          message: 'Image object not found',
          success: false
        })
      } else {
        const transform = sharp(image.data.data)
          .resize(parseInt(req.query.width), parseInt(req.query.height))

        if (req.query.rotate) transform.rotate(parseInt(req.query.rotate))

        transform
          .toBuffer()
          .then(data => {
            res.contentType(image.data.contentType)
              .send(data)
          })
          .catch(err => next)
      }
    })
}
