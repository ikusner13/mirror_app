import React, { useState, useEffect } from 'react';
import socket from '../../services/socket';
import './spotify.css';

interface ISpotify {
  imgURL: string;
  songTitle: string;
  artist: string;
  album: string;
  noSong: boolean;
}

const Spotify = () => {
  const test: ISpotify = {
    imgURL: './png/paige.png',
    songTitle: 'Song Title Song Title Song Title Song Title Song Title ',
    artist: 'Artist',
    album: 'album',
    noSong: false,
  };
  // const [songInfo, setSongInfo] = useState({ noSong: true })
  const [songInfo, setSongInfo] = useState<ISpotify>(test);

  useEffect(() => {
    socket.on('getPlayBackState', (data: ISpotify) => {
      setSongInfo(data);
    });
  }, []);

  return !songInfo.noSong ? (
    <div className="nowPlaying">
      <img className="albumCover" src={songInfo.imgURL} alt="album" />
      <div className="songInfo">
        <i className="fa fa-music" />
        {songInfo.songTitle}
      </div>
      <div className="songInfo">
        <i className="fa fa-user" />
        {songInfo.artist}
      </div>
      <div className="songInfo">
        <i className="fa fa-folder" />
        {songInfo.album}
      </div>
    </div>
  ) : (
    <div>
      <img
        src="./png/umbrella.png"
        alt="spotify"
        width="150"
        height="150"
      ></img>
    </div>
  );
};

export default Spotify;
