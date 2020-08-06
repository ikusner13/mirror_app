const express = require('express')
const app = express()
const http = require('http').createServer(app)
//const io = require('socket.io')(http)
const { port } = require('../config')
const path = require('path')
const sockets = require('./socket')

//app.use(cors())
app.use(function (req, res, next) {
  const origin = req.get('origin')
  res.header('Access-Control-Allow-Origin', origin)
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma',
  )

  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
  } else {
    //console.log('origin', origin);
    next()
  }
})

//app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('build'))

sockets.startSocket(http)
http.listen(port, () => {
  console.log(`listening on port ${port}`)
})
