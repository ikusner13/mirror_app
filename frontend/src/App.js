import React from 'react'
import './App.css'
import Clock from './components/Clock'
import Date from './components/Date'
import CurrentWeather from './components/CurrentWeather'
import Spotify from './components/Spotify'
import Message from './components/Message'
import Calendar from './components/Calendar'
import GooglePhotos from './components/GooglePhotos'

import {
  Grid,
  TopLeft,
  TopRight,
  Middle,
  BottomLeft,
  BottomRight,
} from './styled/Grid'

function App() {
  return (
    <Grid>
      <TopLeft>
        <Clock />
        <Calendar />
      </TopLeft>
      <TopRight>
        <Date />
        <CurrentWeather />
      </TopRight>
      <Middle>
        <Message />
      </Middle>
      <BottomLeft>
        <Spotify />
      </BottomLeft>
      <BottomRight>
        <GooglePhotos />
      </BottomRight>
    </Grid>
  )
}

export default App
