import React, { useState, useEffect } from 'react'
import socket from '../services/socket'
import { Event, Calendar as MyCalendar, EventTime } from '../styled/Calendar'
const Calendar = () => {
  const item = {
    start: ['aaaa', 'aaa', 'aaa'],
    end: ['aaaa', 'aaa', 'aaa'],
    summary: 'hello hello',
    allDay: false,
    birthday: false,
  }
  const test = Array(5).fill(item)
  const [events, setEvents] = useState([])
  const [holidays, setHolidays] = useState([])
  useEffect(() => {
    socket.on('getEvents', (data) => {
      setEvents(data.events)
      setHolidays(data.holidays)
    })
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
      {holidays.map((holiday, index) => (
        <Event key={index}>{holiday}</Event>
      ))}
    </MyCalendar>
  )
}

export default Calendar
