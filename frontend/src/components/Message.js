import React, { useState, useEffect } from 'react';
import moment from 'moment'
import messages from '../jsons/messages'
import helper from '../config'

const defaults = {
    morningStart: 5,
    morningEnd: 12,
    nightStart: 22,
    nightEnd: 5
}

const currentSet = () => {
    const hour = moment().hour()

    if (hour >= defaults.morningStart && hour < defaults.morningEnd) {
        return messages.morning
    }
    else if (hour >= defaults.nightStart || (hour >= 0 && hour < defaults.nightEnd)) {
        return messages.evening
    }
    else {
        return messages.anyTime
    }
}

const getHoliday = () => {
    const date = moment().format('MM-DD').toString()

    if (messages.holidays.hasOwnProperty(date)) {
        return messages.holidays[date]
    }
    return null
}

const getRandomMessage = (messages) => {
    const length = messages.length - 1
    let randomMessage = Math.floor(Math.random() * length)


    return messages[randomMessage]
}
const Message = () => {
    const [currentMessage, setCurrentMessage] = useState("Hello Paige")

    useEffect(() => {
        const changeMessage = () => {
            if (getHoliday() !== null) {
                setCurrentMessage(getHoliday())
            }
            else {
                const set = currentSet()
                setCurrentMessage(getRandomMessage(set))
            }

            let time = helper.closestRefresh(defaults.morningStart
                , defaults.morningEnd
                , defaults.nightStart
            )
            setTimeout(changeMessage, time)
        }
        setTimeout(() => {
            changeMessage()
        }, 5000);
    }, [])

    return (
        <div className="">
            {currentMessage}
        </div>
    )
}

export default Message