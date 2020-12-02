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

  return !songInfo.noSong ? (
    <SpotifyPlaying songInfo={songInfo} />
  ) : (
    <div>
      <img
        src="./png/snowman.png"
        alt="spotify"
        width="100"
        height="100"
        className="top-buffer"
      ></img>
    </div>
  )
}

export default Spotify
