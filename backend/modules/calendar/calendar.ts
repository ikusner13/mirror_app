import ical, { VEvent } from 'node-ical';
import { RRule } from 'rrule';
import Module from '../module';
import {
  firstFive,
  isAllDay,
  isBirthday,
  getDaysUntilChristmas,
} from './services';

//! FIX CONFIG
const ical_url = '';
const pull_rate = 0;

//calendar
class Calendar extends Module {
  getICS = async () => {
    let events = [];
    const webEvents = await ical.async
      .fromURL(ical_url)
      .catch((err) => console.log(err));

    if (!webEvents) {
      return;
    }

    for (let k in webEvents) {
      if (webEvents.hasOwnProperty(k)) {
        if (webEvents[k].type == 'VEVENT') {
          const vevent = webEvents[k] as VEvent;
          if (vevent.rrule) {
            const rule = vevent.rrule;

            const after_dates = rule.after(new Date());
            if (!Array.isArray(after_dates) || after_dates !== null) {
              vevent.start = after_dates as ical.DateWithTimeZone;
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
              allDay: isAllDay(start, end),
              birthday: isBirthday(summary),
            });
          }
        }
      }
    }

    events.sort((a, b) => {
      const startA = new Date(a.start[0]);
      const startB = new Date(b.start[0]);

      if (startA > startB) return 1;
      if (startA < startB) return -1;
      return 0;
    });

    const fiveEvents = firstFive(events);

    const calendar = {
      events: fiveEvents,
      holidays: [],
    };
    // SOCKET.emit('getEvents', calendar);

    // setTimeout(this.getICS.bind(null, SOCKET), pull_rate);
  };
}

export default Calendar;
