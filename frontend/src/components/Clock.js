import React, { useState, useEffect } from 'react'
//import moment from 'moment'
import dayjs from 'dayjs'

const Clock = () => {
  const [time, setTime] = useState({
    minute: '',
    second: '',
    hour: '',
    period: '',
  })
  useEffect(() => {
    const time = () => {
      setTime({
        second: dayjs().format('ss'),
        minute: dayjs().format('mm'),
        hour: dayjs().format('hh'),
        period: dayjs().format('A'),
      })
      setTimeout(time, 1000)
    }
    time()
  }, [])

  return (
    <div className="time">
      <span>{time.hour}</span>:<span>{time.minute}</span>
      <span className="seconds ">{time.second}</span>
      <span>{time.period}</span>
    </div>
  )
}

export default Clock
