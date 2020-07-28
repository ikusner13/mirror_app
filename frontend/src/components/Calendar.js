import React, { useState, useEffect } from 'react';
//import io from 'socket.io-client'
import socket from '../socket'

const Calendar = () => {
    const [events, setEvents] = useState([])

    useEffect(() => {
        socket.on("getEvents", (data) => {
            console.log('data', data)
            setEvents(data)
        })
    }, [])

    return (
        <div>
            <ul className="eventList">
                {events.map((item, index) => {
                    return (
                        <li key={index} className="events">
                            <i className="fa fa-calendar-o" aria-hidden="true"></i>
                            <span>{item.summary}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Calendar