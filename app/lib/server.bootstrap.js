'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const debug = require('debug')('images-api')
const mongoose = require('mongoose')
mongoose.Promise = Promise;

const config = require('./config')

const routes = require('./routes')

const app = express()

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true,
  }))
  .use(routes)
  // catch 404 and forward to error handler
  .use((req, res, next) => {
    res.status(404).json({success: false})
  })
  // error handler
  .use((err, req, res, next) => {
    debug(err)
    res.status(500).json({success: false})
  })

mongoose.connect(config.db.mongodb.connectString, (err, res) => {
  if (err) {
    throw('ERROR connecting to: ' + config.db.mongodb.connectString + '. ' + err)
  } else {
    debug('Succeeded connected to: ' + config.db.mongodb.connectString)
  }
})

module.exports = app
