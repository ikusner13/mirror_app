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
const moment = require('moment');
//! FIX token_path IMPORT
const token_path = '';
let CALL_TIME = 0;
//! fix any types
class GooglePhotos extends module_1.default {
    constructor() {
        super(...arguments);
        this.googlePhotos = (SOCKET) => __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.getAuthDetails();
            const oAuth2Client = yield this.setCredentials(credentials);
            const url = yield (0, getPhoto_1.getAlbum)(oAuth2Client);
            SOCKET.emit('googlePhotos', url);
            let nextHour = moment().add(1, 'hour').hour();
            CALL_TIME = (0, helpers_1.calculateTimeTil)(nextHour);
            setTimeout(this.googlePhotos.bind(null, SOCKET), CALL_TIME);
        });
        this.getAuthDetails = () => __awaiter(this, void 0, void 0, function* () {
            const data = yield promises_1.default.readFile(__dirname + '/auth.json');
            const content = JSON.parse(data);
            return content;
        });
        this.setCredentials = (creds) => __awaiter(this, void 0, void 0, function* () {
            const { client_id, client_secret, redirect_uris } = creds.installed;
            const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            const tokens = yield promises_1.default.readFile(__dirname + token_path);
            oAuth2Client.setCredentials(JSON.parse(tokens));
            return oAuth2Client;
        });
    }
}
exports.default = GooglePhotos;
