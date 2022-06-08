"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const calendar_1 = __importDefault(require("./calendar"));
const messages_1 = __importDefault(require("./messages"));
const spotify_1 = __importDefault(require("./spotify"));
const weather_1 = __importDefault(require("./weather"));
class ModulesSocketListener {
    constructor(socketInstance) {
        this._SpotifyModule = new spotify_1.default(socketInstance);
        this._MessagesModule = new messages_1.default(socketInstance);
        this._CalendarModule = new calendar_1.default(socketInstance);
        this._WeatherModule = new weather_1.default(socketInstance);
    }
    startEvents() {
        this._SpotifyModule.start();
        this._MessagesModule.start();
        this._CalendarModule.start();
        this._WeatherModule.start();
    }
}
exports.default = ModulesSocketListener;
