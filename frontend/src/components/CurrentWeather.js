import React, { useState, useEffect } from 'react'
import 'weather-icons/css/weather-icons.css'
//import moment from 'moment'
import weather_day_icons from '../jsons/weather-day-icons'
import weather_night_icons from '../jsons/weather-nigh-icons'
import {
  Weather,
  HighLow,
  Condition,
  Temp,
  Description,
  Feel,
} from '../styled/Weather'
import socket from '../services/socket'
import dayjs from 'dayjs'

const defaults = {
  day: weather_day_icons,
  night: weather_night_icons,
}

const CurrentWeather = () => {
  const [weather, setWeather] = useState({
    condition: 'condition',
    temp: '69',
    icon: defaults.day['200'],
    highLow: { high: 0, low: 0 },
    sunSet: '0',
    feel: 0,
  })

  const getDayorNightIcons = (icon) => {
    const hour = dayjs().hour()
    if (hour >= 22 || (hour >= 0 && hour < 7)) {
      return defaults.night[icon]
    } else {
      return defaults.day[icon]
    }
  }

  useEffect(() => {
    socket.on('weather', (data) => {
      setWeather({
        temp: data.main.temp,
        condition: data.weather[0].description,
        highLow: {
          high: Math.round(data.main.temp_max),
          low: Math.round(data.main.temp_min),
        },
        sunSet: data.sys.sunset,
        icon: getDayorNightIcons(data.weather[0].id.toString()),
        feel: Math.round(data.main.feels_like),
      })
    })
  }, [])
  return (
    <Weather>
      <HighLow>
        high {weather.highLow.high}&deg; / Low {weather.highLow.low}&deg;
        <i className="wi wi-sunset" />
        {dayjs.unix(weather.sunSet).format('hh:mm')}
      </HighLow>
      <Condition>
        <Temp>
          <i className={`wi ${weather.icon}`} />
          {Math.round(Number(weather.temp))}&deg;
        </Temp>
        <Description>{weather.condition}</Description>
      </Condition>
      <Feel>Feels Like {weather.feel}&deg;</Feel>
    </Weather>
  )
}

export default CurrentWeather
