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
const googleapis_1 = require("googleapis");
const promises_1 = __importDefault(require("fs/promises"));
const helpers_1 = require("./helpers");
const getPhoto_1 = require("./getPhoto");
const module_1 = __importDefault(require("../module"));
const dayjs_1 = __importDefault(require("dayjs"));
const config_1 = __importDefault(require("config"));
const tokenPath = config_1.default.get('modules.googlePhotos.config.tokenPath');
//! fix any types
class GooglePhotos extends module_1.default {
    constructor() {
        super(...arguments);
        this.googlePhotos = () => __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.getAuthDetails();
            const oAuth2Client = yield this.setCredentials(credentials);
            const url = yield (0, getPhoto_1.getAlbum)(oAuth2Client);
            this.sendSocketEvent('googlePhotos', url);
            const nextHour = (0, dayjs_1.default)().add(1, 'hour').hour();
            const nextCallTime = (0, helpers_1.calculateTimeTil)(nextHour);
            setTimeout(this.googlePhotos, nextCallTime);
        });
        this.getAuthDetails = () => __awaiter(this, void 0, void 0, function* () {
            const data = yield promises_1.default.readFile(__dirname + '/auth.json');
            const content = JSON.parse(data.toString());
            return content;
        });
        this.setCredentials = (creds) => __awaiter(this, void 0, void 0, function* () {
            const { client_id, client_secret, redirect_uris } = creds.installed;
            const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            const tokens = yield promises_1.default.readFile(__dirname + tokenPath);
            oAuth2Client.setCredentials(JSON.parse(tokens.toString()));
            return oAuth2Client;
        });
    }
    start() {
        this.googlePhotos();
    }
}
exports.default = GooglePhotos;
