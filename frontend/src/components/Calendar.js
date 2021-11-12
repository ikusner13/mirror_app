import React, { useState, useEffect } from 'react'
import socket from '../services/socket'
import { firstFive, getDaysUntilChristmas } from '../services/calendarService'
import helper from '../services/helper'
import { Event, Calendar as MyCalendar, EventTime } from '../styled/Calendar'
const Calendar = () => {
  const item = {
    day: 'Sunday',
    startLocal: ['aaaaa', 'aaaaa', 'PM'],
    summary: 'Summary Summary Summary',
    allDay: false,
    birthday: false,
  }
  const test = Array(5).fill(item)
  const [events, setEvents] = useState([])
  //const [christmas, getChristmas] = useState(' ')

  const daysUntilChristmas = async () => {
    //getChristmas(getDaysUntilChristmas())
    setTimeout(daysUntilChristmas, helper.calculateTimeTil(0))
  }

  useEffect(() => {
    socket.on('getEvents', (data) => {
      console.log('Log ~ file: Calendar.js ~ line 16 ~ socket.on ~ data', data)
      setEvents(firstFive(data))
    })
    //daysUntilChristmas()
  }, [])
  return (
    <MyCalendar>
      {events.map((item, index) => {
        const day = item.day
        const time = item.start[1].slice(0, -3)
        const period = item.start[2]
        const summary = item.summary
        const isAllDay = item.allDay
        const isBirthday = item.birthday
        return (
          <Event key={index}>
            <div>
              {isBirthday ? (
                <i className="fa fa-birthday-cake" aria-hidden="true"></i>
              ) : (
                <i className="fa fa-calendar-o" aria-hidden="true"></i>
              )}
              <>{summary}</>
            </div>
            <EventTime>
              {isAllDay ? (
                <span>{day}</span>
              ) : (
                <span>{`${day} at ${time}${period}`}</span>
              )}
            </EventTime>
          </Event>
        )
      })}
    </MyCalendar>
  )
}

export default Calendar

//<div className="float-right">Days until Christmas: {christmas}</div>
