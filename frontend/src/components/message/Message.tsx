import React, { useState, useEffect } from 'react';
import socket from '../../services/socket';
import './message.css';

const Message = () => {
  const [currentMessage, setCurrentMessage] = useState<string>('Hello Paige');

  useEffect(() => {
    socket.on('message', (message: string) => {
      setCurrentMessage(message);
    });
  }, []);

  return <div className="message">{currentMessage}</div>;
};

export default Message;
