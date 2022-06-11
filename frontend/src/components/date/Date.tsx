import React, { useState, useEffect } from 'react';
import helper from '../../services/helper';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import './date.css';

dayjs.extend(advancedFormat);

const CurrentDate = () => {
  const [currentDate, setCurrentDate] = useState<string>(
    dayjs().format('dddd, MMMM Do'),
  );

  useEffect(() => {
    const date = () => {
      setCurrentDate(dayjs().format('dddd, MMMM Do'));
      let timeToTwelve = helper.calculateTimeTil(0);
      setTimeout(date, timeToTwelve);
    };

    date();
  }, []);

  return <div className="date">{currentDate}</div>;
};

export default CurrentDate;
