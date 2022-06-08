import React, { useState, useEffect } from 'react';
import socket from '../../services/socket';
import './spotify.css';

interface ISpotify {
  imgURL: string;
  songTitle: string;
  artist: string;
  album: string;
}

const Spotify = () => {
  // eslint-disable-next-line
  const test: ISpotify = {
    imgURL: './png/paige.png',
    songTitle: 'Song Title Song Title Song Title Song Title Song Title ',
    artist: 'Artist',
    album: 'album',
  };

  // const [songInfo, setSongInfo] = useState<ISpotify>(null);
  const [songInfo, setSongInfo] = useState<ISpotify>(test);

  useEffect(() => {
    socket.on('spotify', (data: ISpotify) => {
      setSongInfo(data);
    });
  }, []);

  return songInfo ? (
    <div className="nowPlaying">
      <img className="albumCover" src={songInfo.imgURL} alt="album" />
      <div className="songInfo">
        <i className="fa fa-music spotifyIcon" />
        <span className="marquee">
          <span>{songInfo.songTitle}</span>
        </span>
        <span className="marquee marquee2">
          <span style={{ color: 'red' }}>{songInfo.songTitle}</span>
        </span>
      </div>
      <div className="songInfo">
        <i className="fa fa-user spotifyIcon" />
        {songInfo.artist}
      </div>
      <div className="songInfo">
        <i className="fa fa-folder spotifyIcon" />
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
