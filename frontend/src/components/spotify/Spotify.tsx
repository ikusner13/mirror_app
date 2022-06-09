import React, { useState, useEffect, useRef } from 'react';
import socket from '../../services/socket';
import Marquee from './Marquee';
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
    // songTitle: 'test test test',
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
        <Marquee text={songInfo.songTitle} />
      </div>
      <div className="songInfo">
        <i className="fa fa-user spotifyIcon" />
        <Marquee text={songInfo.artist} />
      </div>
      <div className="songInfo">
        <i className="fa fa-folder spotifyIcon" />
        <Marquee text={songInfo.album} />
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
