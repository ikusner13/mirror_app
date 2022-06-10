import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './clock.css';

interface ITime {
  minute: string;
  second: string;
  hour: string;
  period: string;
}

const Clock = () => {
  const [time, setTime] = useState<ITime>({
    minute: '',
    second: '',
    hour: '',
    period: '',
  });

  useEffect(() => {
    const time = () => {
      const day = dayjs();
      setTime({
        second: day.format('ss'),
        minute: day.format('mm'),
        hour: day.format('hh'),
        period: day.format('A'),
      });
      setTimeout(time, 1000);
    };
    time();
  }, []);

  return (
    <div className="time">
      <span>{time.hour}</span>:<span>{time.minute}</span>
      <span className="seconds">{time.second}</span>
      <span>{time.period}</span>
    </div>
  );
};

export default Clock;
