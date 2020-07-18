import React, { useState, useEffect } from 'react';
import moment from 'moment'
import messages from '../jsons/messages'



const calculateTime = (hour) => {
    let now = new Date()
    let timeTil12 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0, 0) - now;
    if (timeTil12 < 0) {
        timeTil12 += 86400000
    }
    //console.log(timeTil12)
    return timeTil12
}



const Message = () => {
    const [currentMessage, setCurrentMessage] = useState("Are you from tennesse? Because you're the only 10 I see")
    const [previousMessage, setPreviousMesssage] = useState('')

    const changeMessage = () => {
        setCurrentMessage(getRandomMessage(messages.anyMessages))
        setPreviousMesssage(currentMessage)
        let time = calculateTime(8)
        //console.log(time)
        setTimeout(changeMessage, time)
    }

    const getRandomMessage = (messages) => {
        const length = messages.length - 1
        let randomMessage = Math.floor(Math.random() * length)

        while (messages[randomMessage] === previousMessage) {
            randomMessage = Math.floor(Math.random() * length)
        }

        return messages[0]
    }

    useEffect(() => {
        setTimeout(() => {
            changeMessage()
        }, 5000);
    }, [])

    return (
        <div className="">

            {currentMessage} &#128579;
        </div>
    )
}

export default Message