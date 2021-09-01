const fetch = require('node-fetch')

const defaults = {
  time: 10,
  ZIP: '44240',
  api_key: 'b8d8163c79b9574cc193215f73d445c9',
}

let api_uri = `https://api.openweathermap.org/data/2.5/weather?zip=${defaults.ZIP},us&units=imperial&appid=${defaults.api_key}`

const getWeather = async (socket) => {
  const fetch_res = await fetch(api_uri)
  const json = await fetch_res.json()
  socket.emit('weather', json)

  setTimeout(getWeather.bind(null, socket), defaults.time * 60000)
}

module.exports = { getWeather }
