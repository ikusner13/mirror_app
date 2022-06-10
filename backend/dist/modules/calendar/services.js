"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDaysUntilChristmas = exports.isBirthday = exports.isAllDay = exports.firstFive = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const calendar_1 = __importDefault(require("dayjs/plugin/calendar"));
dayjs_1.default.extend(calendar_1.default);
//! fix any types
const firstFive = (events) => {
    if (events.length > 5) {
        const five = events.splice(0, 5);
        return getTime(five);
    }
    return getTime(events);
};
exports.firstFive = firstFive;
const getTime = (events) => {
    const newEvents = [...events];
    newEvents.forEach((element) => {
        element.day = (0, dayjs_1.default)(element.start[0], 'M/D/YYYY').calendar(null, {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            sameElse: function () {
                const startOfDayEvent = (0, dayjs_1.default)(element.start[0]).startOf('day');
                const startOfDayToday = (0, dayjs_1.default)().startOf('day');
                const diffDays = startOfDayEvent.diff(startOfDayToday, 'days');
                return `In ${diffDays} days`;
            },
        });
    });
    return newEvents;
};
const isAllDay = (start, end) => {
    const startTime = start[1];
    const startPeriod = start[2];
    const endTime = end[1];
    const endPeriod = end[2];
    return startTime === endTime && startPeriod === endPeriod;
};
exports.isAllDay = isAllDay;
const isBirthday = (eventSummary) => {
    const summary = eventSummary.toLowerCase();
    return summary.includes('birthday') || summary.includes('bday');
};
exports.isBirthday = isBirthday;
const getDaysUntilChristmas = () => {
    const today = new Date();
    const cmas = new Date(today.getFullYear(), 11, 25);
    if (today.getMonth() == 11 && today.getDate() > 25) {
        cmas.setFullYear(cmas.getFullYear() + 1);
    }
    const one_day = 1000 * 60 * 60 * 24;
    const daysTill = Math.ceil((cmas.getTime() - today.getTime()) / one_day);
    return `${daysTill} days left until Christmas!`;
};
exports.getDaysUntilChristmas = getDaysUntilChristmas;
