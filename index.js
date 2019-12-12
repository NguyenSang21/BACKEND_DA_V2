/**
 * Created by sang.nguyen on 06/12/2019
 */

// Set app environment
require('./config/.env')
// Set other app paths
require('./global_paths')
// Set config variables
global.CONFIG = require(`./config/${process.app_env}`)
const { port, sslPort } = global.CONFIG.app
const dbConfig = global.CONFIG.db
const express = require('express')
const app = express()
const http = require('http')
const https = require('https')
const mongoose = require('mongoose')

const cors = require('cors')
// import routes path
const routes = require(global.APP_ROUTE_PATH)

app.use(cors())
// define routes list
app.use('/api', routes)

// default routes
app.use('/', (req, res) => {
  res.statusCode = 200 // send the appropriate status code
  res.json({status: 'success', message: 'WELCOME TO BACKEND'})
})

const secureServer = https.createServer({}, app)
const server = http.createServer(app)
server.on('listening', onListening)
server.on('error', onError)
secureServer.on('listening', onListening)
secureServer.on('error', onError)

// Connect to DB
mongoose.Promise = global.Promise
mongoose.connect(dbConfig.url, dbConfig.options)
  .then(() => {
    console.log('db connected: ', dbConfig)
    server.listen(port)
    secureServer.listen(sslPort)
  })
  .catch(error => {
    console.log('connect db error: ', error)
  })
mongoose.set('debug', true)

module.exports = app

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error('requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error('port is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`

  console.log('Server listenning on port:', addr.port)
}