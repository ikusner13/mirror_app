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
const helpers_1 = require("./helpers");
const module_1 = __importDefault(require("../module"));
const dayjs_1 = __importDefault(require("dayjs"));
const config_1 = __importDefault(require("config"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const albumTitle = config_1.default.get('modules.googlePhotos.config.albumTitle');
const token = config_1.default.get('modules.googlePhotos.token');
const auth = config_1.default.get('modules.googlePhotos.auth');
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
class GooglePhotos extends module_1.default {
    constructor() {
        super(...arguments);
        this._albumLength = 0;
        this._lastPhotos = [];
        this.googlePhotos = () => __awaiter(this, void 0, void 0, function* () {
            const oAuth2Client = yield this.getAuthDetails();
            const url = yield this.getPhotoUrl(oAuth2Client);
            this.sendSocketEvent('googlePhotos', url);
            const nextHour = (0, dayjs_1.default)().add(1, 'hour').hour();
            const nextCallTime = (0, helpers_1.calculateTimeTil)(nextHour);
            setTimeout(this.googlePhotos, nextCallTime);
        });
        this.getAuthDetails = () => __awaiter(this, void 0, void 0, function* () {
            const { client_id, client_secret, redirect_uris } = auth.installed;
            const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            oAuth2Client.setCredentials(Object.assign({}, token));
            return oAuth2Client;
        });
    }
    start() {
        console.log('starting googlePhotos');
        this.googlePhotos();
    }
    getPhotoUrl(auth) {
        return __awaiter(this, void 0, void 0, function* () {
            const albumId = yield this.getAlbum(auth);
            if (albumId) {
                return yield this.getPhotoFromAlbum(auth, albumId);
            }
            return '';
        });
    }
    getAlbum(auth) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const headers = yield auth.getRequestHeaders('https://photoslibrary.googleapis.com/v1/albums');
                const albumData = yield (0, node_fetch_1.default)('https://photoslibrary.googleapis.com/v1/albums', {
                    method: 'get',
                    headers: headers,
                });
                const data = yield albumData.json();
                const albums = data.albums;
                const album = albums.find((album) => album.title === albumTitle);
                // if found album
                if (album) {
                    return album.id;
                }
                // if album is not found, and there is next page to look at
                // idk if this is doing anything since query param isnt being sent
                if (data.nextPageToken) {
                    yield delay(500);
                    this.getAlbum(auth);
                }
                else {
                    throw new Error('could not find album');
                }
            }
            catch (error) {
                console.error(`🦄 ${Date.now().toString()} object: ${JSON.stringify(error, null, 4)}`);
            }
        });
    }
    getRandomPhoto(photoUrls) {
        if (this._lastPhotos.length === 0) {
            for (let i = 0; i < photoUrls.length; i++) {
                this._lastPhotos.push(i);
            }
            this._albumLength = photoUrls.length;
        }
        if (this._albumLength !== photoUrls.length) {
            if (this._albumLength < photoUrls.length) {
                for (let i = this._albumLength; i < photoUrls.length; i++) {
                    this._lastPhotos.push(i);
                }
            }
            else {
                this._lastPhotos.length = 0;
                for (let i = 0; i < photoUrls.length; i++) {
                    this._lastPhotos.push(i);
                }
            }
            this._albumLength = photoUrls.length;
        }
        const returnPhoto = (0, helpers_1.randPhoto)(photoUrls, this._lastPhotos);
        const PhotoUrlsIndex = photoUrls.indexOf(returnPhoto);
        const lastPhotosIndex = this._lastPhotos.indexOf(PhotoUrlsIndex);
        if (lastPhotosIndex > -1) {
            this._lastPhotos.splice(lastPhotosIndex, 1);
        }
        return returnPhoto;
    }
    getPhotoFromAlbum(auth, albumId) {
        return __awaiter(this, void 0, void 0, function* () {
            let photoUrls = [];
            const fetchPhotos = (pageToken = '') => __awaiter(this, void 0, void 0, function* () {
                let body = {
                    pageSize: '100',
                    pageToken,
                    albumId,
                };
                const url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search';
                const res = yield (0, node_fetch_1.default)(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + auth.credentials.access_token,
                    },
                    body: JSON.stringify(body),
                });
                const photos = yield res.json();
                if (photos.mediaItems) {
                    photos.mediaItems.forEach((element) => {
                        photoUrls.push(element.baseUrl);
                    });
                }
                if (photos.nextPageToken) {
                    yield delay(500);
                    fetchPhotos(photos.nextPageToken);
                }
                else {
                    return this.getRandomPhoto(photoUrls);
                }
            });
            return (yield fetchPhotos());
        });
    }
}
exports.default = GooglePhotos;
