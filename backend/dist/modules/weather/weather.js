"use strict";
// const { pull_rate, api_key, ZIP } =
//   require('../../../config/config').modules.find((obj) => {
//     return obj.module === 'weather';
//   }).config;
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = __importDefault(require("../module"));
const pull_rate = 0;
const api_key = '';
const ZIP = '';
let api_uri = `https://api.openweathermap.org/data/2.5/weather?zip=${ZIP},us&units=imperial&appid=${api_key}`;
class Weather extends module_1.default {
    constructor() {
        super(...arguments);
        this.getWeather = (socket) => __awaiter(this, void 0, void 0, function* () {
            const fetch_res = yield fetch(api_uri).catch((error) => console.log(error));
            if (fetch_res) {
                const json = yield fetch_res.json();
                socket.emit('weather', json);
            }
            setTimeout(this.getWeather.bind(null, socket), pull_rate);
        });
    }
}
exports.default = Weather;
