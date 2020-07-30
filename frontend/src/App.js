import React from 'react';
import './App.css';
import Clock from './components/Clock'
import Date from './components/Date'
import Dog from './components/Dogs'
import CurrentWeather from './components/CurrentWeather'
import Spotify from './components/Spotify'
import Message from './components/Message'
import Calendar from './components/Calendar'

import { Row, Col, Container } from "react-bootstrap"

function App() {
  return (
    <div >
      <Container fluid={true}>

        <Row className="" >
          <Col md={6} className="" >
            <Date className="Date" />
            <Clock className="Clock" />
          </Col>
          <Col md={{ span: 4, offset: 2 }} className="text-right">
            <CurrentWeather />
          </Col>
        </Row>

        <Row>
          <Col>
            <Calendar />
          </Col>
        </Row>

        <Row className="second-bottom message-size">
          <Col md={{ span: 11, offset: 0 }} className="text-center">

          </Col>
        </Row>

        <Row className="bottom " >
          <Col md={6} className="spotify mt-auto" >
            <Spotify />
          </Col>
          <Col md={{ span: 3, offset: 3 }} className="" >
            <Dog />
          </Col>
        </Row>
      </Container>
    </div >
  );
}

export default App;
