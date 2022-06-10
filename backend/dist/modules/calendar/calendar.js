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
const node_ical_1 = __importDefault(require("node-ical"));
const module_1 = __importDefault(require("../module"));
const services_1 = require("./services");
const config_1 = __importDefault(require("config"));
const icalURL = config_1.default.get('modules.calendar.config.icalUrl');
const pullRate = config_1.default.get('modules.calendar.config.pullRate');
class Calendar extends module_1.default {
    constructor() {
        super(...arguments);
        this.getICS = () => __awaiter(this, void 0, void 0, function* () {
            let events = [];
            const webEvents = yield node_ical_1.default.async
                .fromURL(icalURL)
                .catch((err) => console.log(err));
            if (!webEvents) {
                return;
            }
            for (let k in webEvents) {
                if (webEvents.hasOwnProperty(k)) {
                    if (webEvents[k].type == 'VEVENT') {
                        const vevent = webEvents[k];
                        if (vevent.rrule) {
                            const rule = vevent.rrule;
                            const after_dates = rule.after(new Date());
                            if (!Array.isArray(after_dates) || after_dates !== null) {
                                vevent.start = after_dates;
                            }
                        }
                        if (new Date(vevent.start) >= new Date()) {
                            const start = vevent.start.toLocaleString().split(' ');
                            start[0] = start[0].slice(0, -1);
                            const end = vevent.end.toLocaleString().split(' ');
                            end[0] = end[0].slice(0, -1);
                            const summary = vevent.summary;
                            events.push({
                                start,
                                end,
                                summary,
                                allDay: (0, services_1.isAllDay)(start, end),
                                birthday: (0, services_1.isBirthday)(summary),
                            });
                        }
                    }
                }
            }
            events.sort((a, b) => {
                const startA = new Date(a.start[0]);
                const startB = new Date(b.start[0]);
                if (startA > startB)
                    return 1;
                if (startA < startB)
                    return -1;
                return 0;
            });
            const fiveEvents = (0, services_1.firstFive)(events);
            const calendar = {
                events: fiveEvents,
                holidays: [], //add functions when holidays
            };
            this.sendSocketEvent('calendar', calendar);
            setTimeout(this.getICS, pullRate);
        });
    }
    start() {
        console.log('starting calendar');
        this.getICS();
    }
}
exports.default = Calendar;
