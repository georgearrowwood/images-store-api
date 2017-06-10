'use strict'

const express = require('express')
const bodyParser = require('body-parser')

// const config = require('./config')

const routes = require('./routes')

const app = express()

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true,
  }))
  .use(routes)
  // catch 404 and forward to error handler
  .use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  })


module.exports = app
