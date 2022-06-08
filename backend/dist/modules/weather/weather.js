"use strict";
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
const config_1 = __importDefault(require("config"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const pullRate = config_1.default.get('modules.weather.config.pullRate');
const APIKey = config_1.default.get('modules.weather.config.APIKey');
const ZIP = config_1.default.get('modules.weather.config.ZIP');
const api_uri = `https://api.openweathermap.org/data/2.5/weather?zip=${ZIP},us&units=imperial&appid=${APIKey}`;
class Weather extends module_1.default {
    constructor() {
        super(...arguments);
        this.getWeather = () => __awaiter(this, void 0, void 0, function* () {
            const fetch_res = yield (0, node_fetch_1.default)(api_uri).catch((error) => console.log(error));
            if (fetch_res) {
                const json = yield fetch_res.json();
                this.sendSocketEvent('weather', json);
            }
            setTimeout(this.getWeather, pullRate);
        });
    }
    start() {
        this.getWeather();
    }
}
exports.default = Weather;
