// const { pull_rate, api_key, ZIP } =
//   require('../../../config/config').modules.find((obj) => {
//     return obj.module === 'weather';
//   }).config;

import Module from '../module';

const pull_rate = 0;
const api_key = '';
const ZIP = '';

let api_uri = `https://api.openweathermap.org/data/2.5/weather?zip=${ZIP},us&units=imperial&appid=${api_key}`;

class Weather extends Module {
  getWeather = async (socket: any) => {
    const fetch_res = await fetch(api_uri).catch((error) => console.log(error));

    if (fetch_res) {
      const json = await fetch_res.json();
      socket.emit('weather', json);
    }

    setTimeout(this.getWeather.bind(null, socket), pull_rate);
  };
}

export default Weather;
