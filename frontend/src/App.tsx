import React from 'react';
import Clock from './components/clock/Clock';
import Date from './components/date/Date';
import CurrentWeather from './components/weather/CurrentWeather';
import Spotify from './components/spotify/Spotify';
import Message from './components/message/Message';
import Calendar from './components/calendar/Calendar';
import GooglePhotos from './components/googlePhotos/GooglePhotos';
import './App.css';

function App() {
  return (
    <div className="layout">
      <div className="topLeft">
        <Clock />
        <Calendar />
      </div>
      <div className="topRight">
        <Date />
        <CurrentWeather />
      </div>
      <div className="pArea" />
      <div className="middle">
        <Message />
      </div>
      <div className="bottomLeft">
        <Spotify />
      </div>
      <div className="bottomRight">
        <GooglePhotos />
      </div>
    </div>
  );
}

export default App;
