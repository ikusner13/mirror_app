import React, { useState, useEffect } from 'react';
import moment from 'moment'

const Clock = () => {
    const [minute, setMinute] = useState('')
    const [second, setSecond] = useState('')
    const [hour, setHour] = useState('')
    const [periods, setPeriods] = useState('')

    useEffect(() => {
        const time = () => {
            setHour(moment().format('hh'))
            setMinute(moment().format('mm'))
            setSecond(moment().format('ss'))
            setPeriods(moment().format('A'))
            setTimeout(time, 1000)
        }
        time()
    }, [])

    return (
        <div className="display-4 clock-size">
            <span className="">{hour}</span>:
            <span className="">{minute}</span>
            <span className="seconds ">{second}</span>
            <span className="periods ">{periods}</span>
        </div>
    )
}

export default Clock