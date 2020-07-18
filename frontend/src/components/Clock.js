import React, { useState, useEffect } from 'react';
import moment from 'moment'

const Clock = () => {
    const [minute, setMinute] = useState('')
    const [second, setSecond] = useState('')
    const [hour, setHour] = useState('')
    const [periods, setPeriods] = useState('')

    const time = () => {
        setHour(moment().format('hh'))
        setMinute(moment().format('mm'))
        setSecond(moment().format('ss'))
        setPeriods(moment().format('a'))
        setTimeout(time, 1000)
    }
    useEffect(() => {
        time()
    }, [])

    return (
        <div>
            <span className="">{hour}</span>:
            <span className="">{minute}</span>
            <span className="seconds ">{second}</span>
            <span className="periods">{periods}</span>
        </div>
    )
}

export default Clock