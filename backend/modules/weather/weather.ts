import Module from '../module';
import config from 'config';
import fetch from 'node-fetch';

const pullRate: number = config.get('modules.weather.config.pullRate');
const APIKey: string = config.get('modules.weather.config.APIKey');
const ZIP: string = config.get('modules.weather.config.ZIP');

const api_uri = `https://api.openweathermap.org/data/2.5/weather?zip=${ZIP},us&units=imperial&appid=${APIKey}`;

class Weather extends Module {
  public start() {
    this.getWeather();
  }
  private getWeather = async () => {
    const fetch_res = await fetch(api_uri).catch((error) => console.log(error));

    if (fetch_res) {
      const json = await fetch_res.json();
      this.sendSocketEvent('weather', json);
    }

    setTimeout(this.getWeather, pullRate);
  };
}

export default Weather;
