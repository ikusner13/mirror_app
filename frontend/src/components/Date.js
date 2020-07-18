import React, { useState, useEffect } from 'react';
import moment from 'moment'

const calculateTime = () => {
    let now = new Date()
    let timeTil12 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0) - now;
    if (timeTil12 < 0) {
        timeTil12 += 86400000
    }
    //console.log(timeTil12)
    return timeTil12
}

const CurrentDate = () => {
    const [currentDate, setCurrentDate] = useState(moment().format('LL'))


    const date = () => {
        setCurrentDate(moment().format('LL'))
        console.log('New Date')
        let timeToTwelve = calculateTime()
        setTimeout(date, timeToTwelve)
    }
    useEffect(() => {
        date()
    })

    return (
        <div>
            {currentDate}
        </div>
    )

}

export default CurrentDate