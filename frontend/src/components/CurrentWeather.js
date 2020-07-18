import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'weather-icons/css/weather-icons.css'
import moment from 'moment'
import weather_day_icons from '../jsons/weather-day-icons'
import weather_night_icons from '../jsons/weather-nigh-icons'

const ZIP = '44240'
const api_key = 'b8d8163c79b9574cc193215f73d445c9'
let api_uri = `https://api.openweathermap.org/data/2.5/weather?zip=${ZIP},us&units=imperial&appid=${api_key}`
//const api_uri2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=${api_key}`

const updateMinutes = 15
const updateTime = updateMinutes * 60000 //minutes 


const CurrentWeather = () => {
    const [condition, setCondition] = useState('')
    const [temp, setTemp] = useState('')
    const [icon, setIcon] = useState('')
    const [iconType, setIconType] = useState('')

    const getDayorNightIcons = () => {
        const hour = moment().hour()
        if (hour >= 23 || (hour >= 1 && hour < 7)) {
            setIconType(weather_night_icons)
        }
        else {
            setIconType(weather_day_icons)
        }
    }

    const fetchData = async () => {
        const fetch_res = await fetch(api_uri)
        const json = await fetch_res.json()
        console.log(json)
        setTemp(json.main.temp)

        setCondition(json.weather[0].description)

        setIcon((json.weather[0].id).toString())

        getDayorNightIcons()
        setTimeout(fetchData, updateTime)
    }

    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div>
            <Container fluid={true}>
                <Row >
                    <Col className="text-right" >
                        <div className="tempDegree ">
                            <i className={`wi ${iconType[icon]}`} />
                            <span className="temp">{Math.round(Number(temp))}&deg;</span>
                        </div>
                    </Col>
                </Row>
                <Row >
                    <Col className="text-right">

                        <p >{condition}</p>

                    </Col>
                </Row>
            </Container>


        </div>
    )
}

export default CurrentWeather