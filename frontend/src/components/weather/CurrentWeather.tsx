import React, { useState, useEffect } from 'react';
import 'weather-icons/css/weather-icons.css';
import weather_day_icons from '../../jsons/weather-day-icons';
import weather_night_icons from '../../jsons/weather-nigh-icons';
import socket from '../../services/socket';
import dayjs from 'dayjs';
import './weather.css';

interface IWeather {
  condition: string;
  temp: number;
  icon: string;
  highLow: { high: number; low: number };
  sunSet: number;
  feel: number;
}

interface IWeatherMapPayload {
  coord: { lon: number; lat: number };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number; deg: number; gust: number };
  clouds: { all: number };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

const defaults = {
  day: weather_day_icons,
  night: weather_night_icons,
};

const CurrentWeather = () => {
  const [weather, setWeather] = useState<IWeather>({
    condition: 'condition',
    temp: 69,
    icon: defaults.day['200'],
    highLow: { high: 0, low: 0 },
    sunSet: 0,
    feel: 0,
  });

  const getDayOrNightIcons = (icon: string) => {
    const hour = dayjs().hour();

    if (hour >= 22 || (hour >= 0 && hour < 7)) {
      return defaults.night[icon];
    } else {
      return defaults.day[icon];
    }
  };

  useEffect(() => {
    socket.on('weather', (data: IWeatherMapPayload) => {
      setWeather({
        temp: data.main.temp,
        condition: data.weather[0].description,
        highLow: {
          high: Math.round(data.main.temp_max),
          low: Math.round(data.main.temp_min),
        },
        sunSet: data.sys.sunset,
        icon: getDayOrNightIcons(data.weather[0].id.toString()),
        feel: Math.round(data.main.feels_like),
      });
    });
  }, []);

  return (
    <div className="weatherContainer">
      <div className="highLow">
        high {weather.highLow.high}&deg; / low {weather.highLow.low}&deg;
        <i className="wi wi-sunset weatherIcon" />
        {dayjs.unix(weather.sunSet).format('hh:mm')}
      </div>
      <div className="condition">
        <span className="temp">
          <i className={`wi ${weather.icon} weatherIcon`} />
          {Math.round(Number(weather.temp))}&deg;
        </span>
        <span>{weather.condition}</span>
      </div>
      <div>feels like {weather.feel}&deg;</div>
    </div>
  );
};

export default CurrentWeather;
