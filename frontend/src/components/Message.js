import React, { useState, useEffect } from 'react'
import socket from '../services/socket'

const Message = () => {
  const [currentMessage, setCurrentMessage] = useState('Hello Paige')

  useEffect(() => {
    socket.on('message', (message) => {
      console.log(message)
      setCurrentMessage(message)
    })
  }, [])
  return (
    <div className="">
      <span className="">{currentMessage}</span>
    </div>
  )
}

export default Message
