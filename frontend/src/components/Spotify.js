import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import SpotifyPlaying from './Spotify-playing'

const SERVER = 'http://localhost:5000/'

const socket = io(SERVER)

const Spotify = () => {
    const [songInfo, setSongInfo] = useState({ noSong: true })

    useEffect(() => {
        socket.on("getPlayBackState", (data) => {
            setSongInfo(data)
        })
        socket.on('connect_error', () => {
            setSongInfo({ noSong: true })
        })
    }, [])

    if (!songInfo.noSong) {
        return (
            <SpotifyPlaying
                songInfo={songInfo}
            />
        )
    }
    else {
        return (
            <div>
                <img
                    src="./png/spotify.png"
                    alt="spotify"
                    width="150"
                    height="150"
                    className="top-buffer"
                >
                </img>
            </div>
        )
    }
}

export default Spotify

