const spotify = require('./spotify')
const calendar = require('./calendar')
//const googlePhotos = require('./googleauth')

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
      }
    })
  },
}
