import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import 'weather-icons/css/weather-icons.css'
import moment from 'moment'
import weather_day_icons from '../jsons/weather-day-icons'
import weather_night_icons from '../jsons/weather-nigh-icons'
import {
  Weather,
  HighLow,
  Condition,
  Temp,
  Description,
} from '../styled/Weather'
import socket from '../services/socket'

const defaults = {
  updateTime: 10,
  ZIP: '44240',
  api_key: 'b8d8163c79b9574cc193215f73d445c9',
  day: weather_day_icons,
  night: weather_night_icons,
}

let api_uri = `https://api.openweathermap.org/data/2.5/weather?zip=${defaults.ZIP},us&units=imperial&appid=${defaults.api_key}`

const updateTime = defaults.updateTime * 60000 //minutes

const CurrentWeather = () => {
  const [condition, setCondition] = useState('condition')
  const [temp, setTemp] = useState('69')
  const [icon, setIcon] = useState('200')
  const [iconType, setIconType] = useState(defaults.day)
  const [highLow, setHighLow] = useState({ high: 0, low: 0 })
  const [sunSet, setSunSet] = useState(0)

  const getDayorNightIcons = () => {
    const hour = moment().hour()
    if (hour >= 22 || (hour >= 0 && hour < 7)) {
      setIconType(defaults.night)
    } else {
      setIconType(defaults.day)
    }
  }

  useEffect(() => {
    /*const fetchData = async () => {
      const fetch_res = await fetch(api_uri)
      console.log(
        'Log ~ file: CurrentWeather.js ~ line 40 ~ fetchData ~ fetch_res',
        fetch_res,
      )
      const json = await fetch_res.json()

      setTemp(json.main.temp)

      setCondition(json.weather[0].description)

      setIcon(json.weather[0].id.toString())
      setHighLow({ high: json.main.temp_max, low: json.main.temp_min })
      setSunSet(json.sys.sunset)
      getDayorNightIcons()
      setTimeout(fetchData, updateTime)
    }
    fetchData()*/
    socket.on('weather', (data) => {
      setTemp(data.main.temp)

      setCondition(data.weather[0].description)

      setIcon(data.weather[0].id.toString())
      setHighLow({ high: data.main.temp_max, low: data.main.temp_min })
      setSunSet(data.sys.sunset)
      getDayorNightIcons()
    })
  }, [])
  return (
    <Weather>
      <HighLow>
        high {Math.round(highLow.high)}&deg; / low {Math.round(highLow.low)}
        &deg;
        <i className="wi wi-sunset" />
        {moment.unix(sunSet).format('hh:mm')}
      </HighLow>
      <Condition>
        <Temp>
          <i className={`wi ${iconType[icon]}`} />
          {Math.round(Number(temp))}&deg;
        </Temp>
        <Description>{condition}</Description>
      </Condition>
    </Weather>
  )
}

export default CurrentWeather
