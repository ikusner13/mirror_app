import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import 'weather-icons/css/weather-icons.css'
import moment from 'moment'
import weather_day_icons from '../jsons/weather-day-icons'
import weather_night_icons from '../jsons/weather-nigh-icons'

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
    const fetchData = async () => {
      const fetch_res = await fetch(api_uri)
      const json = await fetch_res.json()

      setTemp(json.main.temp)

      setCondition(json.weather[0].description)

      setIcon(json.weather[0].id.toString())
      setHighLow({ high: json.main.temp_max, low: json.main.temp_min })
      setSunSet(json.sys.sunset)
      getDayorNightIcons()
      setTimeout(fetchData, updateTime)
    }
    fetchData()
  }, [])
  return (
    <div className="">
      <Container fluid={true}>
        <Row className="weather-text">
          <Col className="text-right weather-col">
            <div className="high-low">
              high {Math.round(highLow.high)}&deg; / low{' '}
              {Math.round(highLow.low)}&deg;
              <i className="wi wi-sunset" />
              {moment.unix(sunSet).format('hh:mm')}
            </div>
            <div className="">
              <i className={`wi ${iconType[icon]} tempDegree`} />
              <span className="temp tempDegree">
                {Math.round(Number(temp))}&deg;
              </span>
              <div className="condition">{condition}</div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default CurrentWeather
