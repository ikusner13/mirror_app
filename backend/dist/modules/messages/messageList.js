"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { modules: { message: { messages }, }, } = require('../../../../config/config');
const dayjs_1 = __importDefault(require("dayjs"));
const weekday_1 = __importDefault(require("dayjs/plugin/weekday"));
const objectSupport_1 = __importDefault(require("dayjs/plugin/objectSupport"));
dayjs_1.default.extend(objectSupport_1.default);
dayjs_1.default.extend(weekday_1.default);
const messagesList = Object.assign({}, messages);
const thanksgiving = () => {
    const year = (0, dayjs_1.default)().year();
    const month = 10;
    // @ts-ignore - type issue with dayjs and objectSupport plugin
    const november = (0, dayjs_1.default)({ year: year, month: month, date: 0 });
    const firstThursday = november.weekday(4);
    const weeks = firstThursday.month() !== month ? 4 : 3;
    return firstThursday.add(weeks, 'week').format('MM-DD');
};
const holiday = {
    '01-01': 'Happy New Years!',
    '02-14': 'Happy Valentines day!',
    '07-24': 'Happy Anniversary!',
    '07-29': 'Happy Birthday!',
    '10-31': 'Happy Halloween!',
    '12-24': 'Merry Christmas Eve',
    '12-25': 'Merry Christmas!',
    '12-31': 'Happy New Years Eve!',
    [thanksgiving()]: 'Happy Thanksgiving!',
};
messagesList.holidays = holiday;
exports.default = messagesList;
