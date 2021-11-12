const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

const { port } = require('../config/config')
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

sockets.startSocket(io)
server.listen(port, () => {
  console.log(`listening on port ${port}`)
})

module.exports = { io }
