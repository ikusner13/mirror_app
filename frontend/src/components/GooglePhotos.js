import React, { useState, useEffect } from 'react'
import socket from '../services/socket'

const GooglePhotos = () => {
  const [photo, setPhoto] = useState('')

  useEffect(() => {
    socket.on('googlePhotos', (data) => {
      setPhoto(data)
    })
  }, [])

  return (
    <div>
      {photo ? (
        <img src={photo} alt="google" width="300" height="300"></img>
      ) : (
        <img src="./png/paige.png" alt="paige" width="300" height="300"></img>
      )}
    </div>
  )
}
export default GooglePhotos
