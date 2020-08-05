import React, { useState, useEffect } from 'react'
//import io from 'socket.io-client'
import SpotifyPlaying from './Spotify-playing'
import socket from '../services/socket'

const Spotify = () => {
  const [songInfo, setSongInfo] = useState({ noSong: true })

  useEffect(() => {
    socket.on('getPlayBackState', (data) => {
      setSongInfo(data)
    })
  }, [])

  if (!songInfo.noSong) {
    return <SpotifyPlaying songInfo={songInfo} />
  } else {
    return (
      <div>
        <img
          src="./png/spotify.png"
          alt="spotify"
          width="150"
          height="150"
          className="top-buffer"
        ></img>
      </div>
    )
  }
}

export default Spotify
