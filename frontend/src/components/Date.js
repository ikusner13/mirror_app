import React, { useState, useEffect } from 'react'
//import moment from 'moment'
import helper from '../services/helper'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)

const CurrentDate = () => {
  const [currentDate, setCurrentDate] = useState(
    dayjs().format('dddd, MMMM Do'),
  )

  const date = () => {
    setCurrentDate(dayjs().format('dddd, MMMM Do'))
    let timeToTwelve = helper.calculateTimeTil(0)
    setTimeout(date, timeToTwelve)
  }
  useEffect(() => {
    date()
  })

  return <div className="date">{currentDate}</div>
}

export default CurrentDate
