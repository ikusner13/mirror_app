import React, { useState, useEffect } from 'react'
import socket from '../services/socket'

const Message = () => {
  const [currentMessage, setCurrentMessage] = useState('Hello Paige')

  useEffect(() => {
    socket.on('message', (message) => {
      setCurrentMessage(message)
    })
  }, [])
  return <div className="message">{currentMessage}</div>
}

export default Message
