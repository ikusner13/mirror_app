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
exports.getAlbum = void 0;
const helpers_1 = require("./helpers");
const node_fetch_1 = __importDefault(require("node-fetch"));
const albumTitle = 'Mirror';
let lastPhotos = [];
let albumLength = 0;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const getAlbum = (auth) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const headers = yield auth.getRequestHeaders('https://photoslibrary.googleapis.com/v1/albums');
        const album = yield (0, node_fetch_1.default)('https://photoslibrary.googleapis.com/v1/albums', {
            method: 'get',
            headers: headers,
        });
        const data = yield album.json();
        const albums = data.albums;
        if (Array.isArray(albums)) {
            for (let album of albums) {
                if (album.title === albumTitle) {
                    return getPhotosFromAlbum(auth, album.id);
                }
            }
        }
        if (data.nextPageToken) {
            yield delay(500);
            getAlbum(auth);
        }
        else {
            return console.log('no matching albums');
        }
    }
    catch (error) {
        console.log('error', error);
    }
});
exports.getAlbum = getAlbum;
const getPhotosFromAlbum = (auth, albumId) => __awaiter(void 0, void 0, void 0, function* () {
    let photoUrls = [];
    let returnUrl = '';
    const fetchPhotos = (pageToken = '') => __awaiter(void 0, void 0, void 0, function* () {
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
            //! fix
            photos.mediaItems.forEach((element) => {
                photoUrls.push(element.baseUrl);
            });
        }
        console.log('photoUrls', photoUrls);
        if (photos.nextPageToken) {
            yield delay(500);
            fetchPhotos(photos.nextPageToken);
        }
        else {
            if (lastPhotos.length === 0) {
                for (let i = 0; i < photoUrls.length; i++) {
                    lastPhotos.push(i);
                }
                albumLength = photoUrls.length;
            }
            if (albumLength !== photoUrls.length) {
                if (albumLength < photoUrls.length) {
                    for (let i = albumLength; i < photoUrls.length; i++) {
                        lastPhotos.push(i);
                    }
                }
                else {
                    lastPhotos.length = 0;
                    for (let i = 0; i < photoUrls.length; i++) {
                        lastPhotos.push(i);
                    }
                }
                albumLength = photoUrls.length;
            }
            returnUrl = (0, helpers_1.randPhoto)(photoUrls, lastPhotos);
            const PhotoUrlsIndex = photoUrls.indexOf(returnUrl);
            const lastPhotosIndex = lastPhotos.indexOf(PhotoUrlsIndex);
            if (lastPhotosIndex > -1) {
                lastPhotos.splice(lastPhotosIndex, 1);
            }
            return returnUrl;
        }
    });
    return yield fetchPhotos();
});
