import React, { useState, useEffect } from 'react'
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
          src="./png/turkey.png"
          alt="spotify"
          width="100"
          height="100"
          //width="150"
          //height="50"
          className="top-buffer"
        ></img>
      </div>
    )
  }
}

export default Spotify
