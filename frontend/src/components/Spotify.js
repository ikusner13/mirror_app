import React, { useState, useEffect } from 'react'
import SpotifyPlaying from './Spotify-playing'
import socket from '../services/socket'

const Spotify = () => {
  const test = {
    imgURL: './png/paige.png',
    songTitle: 'Song Title Song Title Song Title Song Title Song Title ',
    artist: 'Artist',
    album: 'album',
  }
  //const [songInfo, setSongInfo] = useState({ noSong: true })
  const [songInfo, setSongInfo] = useState(test)

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
      ></img>
    </div>
  )
}

export default Spotify
