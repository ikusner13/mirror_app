const spotify = require('./modules/spotify')
const calendar = require('./modules/calendar')
const google = require('./modules/googlePhotos')
const messages = require('./modules/messages')
const weather = require('./modules/weather')
module.exports = {
  startSocket: function (io) {
    //SOCKET SETUP
    io.on('connect', (socket) => {
      console.log('socket Connected')
      spotify.setNowPlaying(socket)
      calendar.getICS(socket)
      google.googlePhotos(socket)
      messages.getMessages(socket)
      //weather.getWeather(socket)
    })
  },
  // sendUpdate: function (notification, data) {},
}
