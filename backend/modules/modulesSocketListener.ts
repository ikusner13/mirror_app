import { Socket } from 'socket.io';
// import Calendar from './calendar';
import Message from './messages';
// import Spotify from './spotify';
// import Weather from './weather';

class ModulesSocketListener {
  // private _SpotifyModule: Spotify;
  private _MessagesModule: Message;
  // private _CalendarModule: Calendar;
  // private _WeatherModule: Weather;

  constructor(socketInstance: Socket) {
    // this._SpotifyModule = new Spotify(socketInstance);
    this._MessagesModule = new Message(socketInstance);
    // this._CalendarModule = new Calendar(socketInstance);
    // this._WeatherModule = new Weather(socketInstance);
  }

  public startListening() {
    console.log('listening');
    // this._SpotifyModule.setNowPlaying();
    this._MessagesModule.getMessages();
    // this._CalendarModule.getICS();
    // this._WeatherModule.getWeather();
  }
}

export default ModulesSocketListener;
