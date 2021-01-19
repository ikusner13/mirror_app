import React, { useState, useEffect } from 'react'
import socket from '../services/socket'
import { firstFive, getDaysUntilChristmas } from '../services/calendarService'
import helper from '../services/helper'
const Calendar = () => {
  const [events, setEvents] = useState([])
  //const [christmas, getChristmas] = useState(' ')

  const daysUntilChristmas = async () => {
    //getChristmas(getDaysUntilChristmas())
    setTimeout(daysUntilChristmas, helper.calculateTimeTil(0))
  }

  useEffect(() => {
    socket.on('getEvents', (data) => {
      setEvents(firstFive(data))
    })
    //daysUntilChristmas()
  }, [])
  return (
    <div>
      <ul className="eventList">
        {events.map((item, index) => {
          const day = item.day
          const time = item.startLocal[1].slice(0, -3)
          const period = item.startLocal[2]
          const summary = item.summary
          const isAllDay = item.allDay
          const isBirthday = item.birthday
          return (
            <li key={index} className="events">
              <div>
                {isBirthday ? (
                  <i className="fa fa-birthday-cake" aria-hidden="true"></i>
                ) : (
                  <i className="fa fa-calendar-o" aria-hidden="true"></i>
                )}
                <>{summary}</>
              </div>
              <div className="dayTime">
                {isAllDay ? (
                  <span>{day}</span>
                ) : (
                  <span>{`${day} at ${time}${period}`}</span>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Calendar

//<div className="float-right">Days until Christmas: {christmas}</div>
