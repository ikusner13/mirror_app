import React, { useState, useEffect } from 'react';
import moment from 'moment'
import helper from '../config'

const CurrentDate = () => {
    const [currentDate, setCurrentDate] = useState(moment().format('LL'))

    const date = () => {
        setCurrentDate(moment().format('dddd, MMMM Do YYYY'))
        console.log('New Date')
        let timeToTwelve = helper.calculateTimeTil(0)
        setTimeout(date, timeToTwelve)
    }
    useEffect(() => {
        date()
    })

    return (
        <div className="">
            {currentDate}
        </div>
    )

}

export default CurrentDate