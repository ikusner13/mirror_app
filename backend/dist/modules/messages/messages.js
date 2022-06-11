"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messageList_1 = __importDefault(require("./messageList"));
const helper_1 = require("./helper");
const dayjs_1 = __importDefault(require("dayjs"));
const module_1 = __importDefault(require("../module"));
const config_1 = __importDefault(require("config"));
const defaults = config_1.default.get('modules.message.config');
class Message extends module_1.default {
    constructor() {
        super(...arguments);
        this._lastMessageIndexes = {
            lastMorningIndex: -1,
            lastAfternoonIndex: -1,
            lastEveningIndex: -1,
        };
        this.getMessages = () => {
            const holiday = this.getHoliday();
            if (holiday) {
                this.sendSocketEvent('message', holiday);
            }
            else {
                const set = this.currentSet();
                this.sendSocketEvent('message', set);
            }
            let time = (0, helper_1.closestRefresh)(defaults.morningStart, defaults.afternoon2, defaults.morningEnd, defaults.nightStart);
            setTimeout(this.getMessages, time);
        };
        this.getRandomMessage = (set, key) => {
            let randomMessage = Math.floor(Math.random() * set.length);
            while (randomMessage === this._lastMessageIndexes[key]) {
                randomMessage = Math.floor(Math.random() * set.length);
            }
            this._lastMessageIndexes[key] = randomMessage;
            return set[randomMessage];
        };
        this.currentSet = () => {
            const hour = (0, dayjs_1.default)().hour();
            if (hour >= defaults.morningStart && hour < defaults.morningEnd) {
                return this.getRandomMessage(messageList_1.default.morning, 'lastMorningIndex');
            }
            else if (hour >= defaults.nightStart ||
                (hour >= 0 && hour < defaults.morningStart)) {
                return this.getRandomMessage(messageList_1.default.evening, 'lastEveningIndex');
            }
            else {
                return this.getRandomMessage(messageList_1.default.anyTime, 'lastAfternoonIndex');
            }
        };
        this.getHoliday = () => {
            const date = (0, dayjs_1.default)().format('MM-DD').toString();
            if (messageList_1.default.holidays.hasOwnProperty(date)) {
                return messageList_1.default.holidays[date];
            }
            return null;
        };
    }
    start() {
        console.log('starting messages');
        this.getMessages();
    }
}
exports.default = Message;
