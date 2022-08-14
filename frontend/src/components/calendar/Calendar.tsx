import React, { useState, useEffect } from 'react';
import socket from '../../services/socket';
import './calendar.css';

interface ICalendarEvent {
  start: string[];
  end: string[];
  summary: string;
  allDay: boolean;
  birthday: boolean;
  day: string;
}

interface ISocketData {
  events: ICalendarEvent[];
  holidays: string[];
}

const Calendar = () => {
  const item: ICalendarEvent = {
    start: ['aaaa', 'aaa', 'aaa'],
    end: ['aaaa', 'aaa', 'aaa'],
    summary: 'hello hello',
    allDay: false,
    birthday: false,
    day: 'day',
  };
  // eslint-disable-next-line
  const test = Array(5).fill(item);
  const [events, setEvents] = useState<ICalendarEvent[]>([]);
  const [holidays, setHolidays] = useState<string[]>([]);

  useEffect(() => {
    socket.on('calendar', (data: ISocketData) => {
      setEvents(data.events);
      setHolidays(data.holidays);
    });
  }, []);

  return (
    <ul className="calendar">
      {events.map((item, index) => {
        const day = item.day;
        const time = item.start[1].slice(0, -3);
        const period = item.start[2];
        const summary = item.summary;
        const isAllDay = item.allDay;
        const isBirthday = item.birthday;
        return (
          <li key={index}>
            <div style={{ display: 'flex' }}>
              {isBirthday ? (
                <i className="fa fa-birthday-cake" aria-hidden="true"></i>
              ) : (
                <i className="fa fa-calendar-o" aria-hidden="true"></i>
              )}
              <div className="eventTitle">{summary}</div>
            </div>
            <div className="eventTime">
              {isAllDay ? (
                <span>{day}</span>
              ) : (
                <span>{`${day} at ${time}${period}`}</span>
              )}
            </div>
          </li>
        );
      })}
      {holidays.map((holiday, index) => (
        <li key={index}>{holiday}</li>
      ))}
    </ul>
  );
};

export default Calendar;
