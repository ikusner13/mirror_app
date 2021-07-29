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
        src="./png/umbrella.png"
        alt="spotify"
        width="150"
        height="150"
        className="top-buffer"
      ></img>
    </div>
  )
}

export default Spotify
