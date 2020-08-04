import React, { useState, useEffect } from 'react'
import socket from '../socket'

const GooglePhotos = () => {
  const [photo, setPhoto] = useState('')

  useEffect(() => {
    socket.on('googlePhotos', (data) => {
      setPhoto(data)
    })
  }, [])

  return (
    <div className="float-right">
      <img src={photo} alt="paige" width="300" height="300"></img>
    </div>
  )
}
export default GooglePhotos
