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
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
const dayjs_1 = __importDefault(require("dayjs"));
const module_1 = __importDefault(require("../module"));
const config_1 = __importDefault(require("config"));
const spotify = config_1.default.get('modules.spotify.config');
//SPOTIFY SETUP
const client_id = spotify.client_id; // Your client id
const client_secret = spotify.client_secret; // Your secret
const redirect_uri = spotify.redirect_uri;
const access_token = spotify.access_token;
const refresh_token = spotify.refresh_token;
const spotifyApi = new spotify_web_api_node_1.default({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri,
});
let tokenExpirationEpoch = (0, dayjs_1.default)();
spotifyApi.setAccessToken(access_token);
spotifyApi.setRefreshToken(refresh_token);
const MIN_PULL = 3000;
let CURRENT_PULL = MIN_PULL;
class Spotify extends module_1.default {
    constructor() {
        super(...arguments);
        this.setNowPlaying = () => __awaiter(this, void 0, void 0, function* () {
            if ((0, dayjs_1.default)().isBefore(tokenExpirationEpoch)) {
                spotifyApi
                    .getMyCurrentPlaybackState({})
                    .then((result) => {
                    CURRENT_PULL = MIN_PULL;
                    //if body return something (is playing)
                    if (Object.keys(result.body).length > 0) {
                        this.sendSocketEvent('spotify', sendablePayload(result.body));
                    }
                    // isn't playing or has been paused for too long
                    else {
                        this.sendSocketEvent('spotify', null);
                    }
                })
                    .catch((error) => {
                    if (error.message === 'Unauthorized') {
                        refresh();
                    }
                    else {
                        CURRENT_PULL = CURRENT_PULL < 5000 ? CURRENT_PULL + 1000 : 5000;
                    }
                });
            }
            else {
                refresh();
            }
            setTimeout(this.setNowPlaying, CURRENT_PULL);
        });
    }
    start() {
        this.setNowPlaying();
    }
}
//! fix any type for next 3
const getImgUrl = (images) => {
    let filtered = images.filter((image) => {
        return image.width >= 240 && image.width <= 350;
    });
    return filtered[0].url;
};
const getArtists = (artists) => {
    return artists
        .map((artist) => {
        return artist.name;
    })
        .join(', ');
};
const sendablePayload = (songInfo) => {
    const payload = {
        imgURL: getImgUrl(songInfo.item.album.images),
        songTitle: songInfo.item.name,
        artist: getArtists(songInfo.item.artists),
        album: songInfo.item.album.name,
    };
    return payload;
};
const refresh = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newToken = yield spotifyApi.refreshAccessToken();
        spotifyApi.setAccessToken(newToken.body['access_token']);
        tokenExpirationEpoch = (0, dayjs_1.default)().add(newToken.body.expires_in, 'second');
    }
    catch (err) {
        //console.log(err.message)
    }
});
exports.default = Spotify;
