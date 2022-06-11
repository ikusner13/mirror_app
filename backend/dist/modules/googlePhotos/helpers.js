"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randPhoto = exports.calculateTimeTil = void 0;
const calculateTimeTil = (hour) => {
    let now = new Date();
    let timeTil = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0, 0).valueOf() - now.valueOf();
    if (timeTil < 0) {
        timeTil += 86400000;
    }
    return timeTil;
};
exports.calculateTimeTil = calculateTimeTil;
const randPhoto = (photos, lastPhotos) => {
    const index = lastPhotos[Math.floor(Math.random() * lastPhotos.length)];
    return photos[index];
};
exports.randPhoto = randPhoto;
