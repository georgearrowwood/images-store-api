'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const autoIncrement = require('mongoose-auto-increment')
const connection = mongoose.connection
autoIncrement.initialize(connection)

const ImageSchema = new Schema({
  id: Number,
  name: String,
  data: {data: Buffer, contentType: String},
  createdAt: {type: Date, default: Date.now}
})

ImageSchema.plugin(autoIncrement.plugin, {model: 'Images', field: 'id', startAt: 1})
module.exports = mongoose.model('Images', ImageSchema);
