"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const googleapis_1 = require("googleapis");
const open_1 = __importDefault(require("open"));
const readline_1 = __importDefault(require("readline"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("./config");
//! fix any types
const createToken = () => {
    fs_1.default.readFile(__dirname + '/auth.json', (err, content) => {
        if (err)
            return console.log('Error loading client file:', err);
        authorize(JSON.parse(content));
    });
};
exports.createToken = createToken;
const authorize = (creds) => {
    const { client_id, client_secret, redirect_uris } = creds.installed;
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: config_1.scopes,
    });
    (0, open_1.default)(authUrl).catch(() => {
        console.log('failed to open url');
        console.log('url ', authUrl);
    });
    const r1 = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    r1.question('Enter the code from url here ', (code) => {
        r1.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err)
                return console.error('Error retrieving access token', err);
            fs_1.default.writeFile(config_1.TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err)
                    return console.error('err');
                console.log('Token stored to', config_1.TOKEN_PATH);
            });
        });
    });
};
