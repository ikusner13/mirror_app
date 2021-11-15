const fetch = require('node-fetch')
const { pull_rate, api_key, ZIP } =
  require('../../../config/config').modules.find((obj) => {
    return obj.module === 'weather'
  }).config

let api_uri = `https://api.openweathermap.org/data/2.5/weather?zip=${ZIP},us&units=imperial&appid=${api_key}`

const getWeather = async (socket) => {
  const fetch_res = await fetch(api_uri)
  const json = await fetch_res.json()
  socket.emit('weather', json)

  setTimeout(getWeather.bind(null, socket), pull_rate)
}

module.exports = { getWeather }
