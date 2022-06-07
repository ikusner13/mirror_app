"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.albumTitle = exports.scopes = exports.CALL_TIME = exports.TOKEN_PATH = void 0;
const helpers_1 = require("./helpers");
const TOKEN_PATH = __dirname + '/token.json';
exports.TOKEN_PATH = TOKEN_PATH;
const CALL_TIME = (0, helpers_1.calculateTimeTil)(0);
exports.CALL_TIME = CALL_TIME;
const scopes = [
    'https://www.googleapis.com/auth/photoslibrary',
    'https://www.googleapis.com/auth/photoslibrary.sharing',
];
exports.scopes = scopes;
const albumTitle = 'Mirror';
exports.albumTitle = albumTitle;
