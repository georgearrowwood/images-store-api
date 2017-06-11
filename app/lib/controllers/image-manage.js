'use strict'

const fs = require('fs')

const ImageModel = require('../models/image')

module.exports.upload = function (req, res, next) {
  fs.readFile(req.files.fileData[0].path, (err, data) => {
    if (err) return next(err)

    const image = new ImageModel();
    image.name =  req.body.fileName ? req.body.fileName : req.files.fileData[0].originalname
    image.data.data = data
    image.data.contentType = req.files.fileData[0].mimetype

    image.save((err, newRecord) => {
      if (err) return next(err)
      fs.unlink(req.files.fileData[0].path)
      res.json({
        id: newRecord._id,
        name: newRecord.name,
        success: true
      })
    })
  });
}

module.exports.remove = function (req, res, next) {
  ImageModel.findOne({id: req.params.id}, (err, image) => {
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image object not found'
      })
    } else {
      image.remove();
      return res.json({
        id: req.params.id,
        message: 'Image object deleted',
        success: true
      })
    }
  })
}
