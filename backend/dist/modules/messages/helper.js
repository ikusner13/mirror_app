"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closestRefresh = exports.calculateTimeTil = void 0;
const calculateTimeTil = (hour) => {
    let now = new Date();
    let timeTil = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0, 0).valueOf() - now.valueOf();
    if (timeTil < 0) {
        timeTil += 86400000;
    }
    return timeTil;
};
exports.calculateTimeTil = calculateTimeTil;
const closestRefresh = (...times) => {
    const timesTil = times.map((hour) => {
        return calculateTimeTil(hour);
    });
    return Math.min(...timesTil);
};
exports.closestRefresh = closestRefresh;
