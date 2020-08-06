const spotify = require('./modules/spotify')
const calendar = require('./modules/calendar')
const google = require('./modules/googlePhotos')
const messages = require('./modules/messages')

module.exports = {
  startSocket: function (server) {
    const io = require('socket.io')(server)
    //SOCKET SETUP
    let connections = 0
    io.on('connect', (socket) => {
      //console.log(io.sockets.eventNames())
      connections++
      //config.SOCKET = socket
      console.log('socket Connected')
      if (connections <= 1) {
        //stops multiple socket connections from calling fetch loop
        spotify.setNowPlaying(socket)
        calendar.getICS(socket)
        google.googlePhotos(socket)
        messages.getMessages(socket)
      }
    })
  },
}
