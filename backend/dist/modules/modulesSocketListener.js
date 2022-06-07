"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import Calendar from './calendar';
const messages_1 = __importDefault(require("./messages"));
// import Spotify from './spotify';
// import Weather from './weather';
class ModulesSocketListener {
    // private _CalendarModule: Calendar;
    // private _WeatherModule: Weather;
    constructor(socketInstance) {
        // this._SpotifyModule = new Spotify(socketInstance);
        this._MessagesModule = new messages_1.default(socketInstance);
        // this._CalendarModule = new Calendar(socketInstance);
        // this._WeatherModule = new Weather(socketInstance);
    }
    startListening() {
        console.log('listening');
        // this._SpotifyModule.setNowPlaying();
        this._MessagesModule.getMessages();
        // this._CalendarModule.getICS();
        // this._WeatherModule.getWeather();
    }
}
exports.default = ModulesSocketListener;
