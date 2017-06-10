'use strict'
const server = require('./lib/server.bootstrap')

const port = process.env.PORT || 3000
const env = process.env.NODE_ENV || 'development'

server
  .listen(port, () => {
    console.log(`Listening on port ${port} env ${env}`)
  })

module.exports = server; // for testing
