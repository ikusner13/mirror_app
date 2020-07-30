import React, { useState, useEffect } from 'react';
//import io from 'socket.io-client'
import socket from '../socket'
import { firstFive, getTime } from '../services/calendarService'
import moment from 'moment'
const Calendar = () => {
    const [events, setEvents] = useState([])

    useEffect(() => {
        socket.on("getEvents", (data) => {
            setEvents(firstFive(data))
        })
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
                    return (
                        <li key={index} className="events">
                            <div>
                                <i className="fa fa-calendar-o" aria-hidden="true"></i>
                                <>{summary}</>
                            </div>
                            <div className="dayTime">
                                {isAllDay
                                    ? <span>{day}</span>
                                    : <span>{`${day} at ${time}${period}`}</span>
                                }
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Calendar