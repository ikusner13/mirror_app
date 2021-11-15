import React, { useState, useEffect } from 'react'
import socket from '../services/socket'
import { SpotifyPlaying, SongImg, SongInfo } from '../styled/Spotify'

const Spotify = () => {
  const test = {
    imgURL: './png/paige.png',
    songTitle: 'Song Title Song Title Song Title Song Title Song Title ',
    artist: 'Artist',
    album: 'album',
  }
  const [songInfo, setSongInfo] = useState({ noSong: true })
  //const [songInfo, setSongInfo] = useState(test)

  useEffect(() => {
    socket.on('getPlayBackState', (data) => {
      setSongInfo(data)
    })
  }, [])

  return !songInfo.noSong ? (
    <SpotifyPlaying>
      <SongImg src={songInfo.imgURL} alt="album" />
      <SongInfo>
        <i className="fa fa-music" />
        {songInfo.songTitle}
      </SongInfo>
      <SongInfo>
        <i className="fa fa-user" />
        {songInfo.artist}
      </SongInfo>
      <SongInfo>
        <i className="fa fa-folder" />
        {songInfo.album}
      </SongInfo>
    </SpotifyPlaying>
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
