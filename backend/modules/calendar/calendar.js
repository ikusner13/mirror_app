const ical = require('node-ical');
const { ical_url, pull_rate } = require('../../../config/config').modules.find(
  (obj) => {
    return obj.module === 'calendar';
  },
).config;
const {
  firstFive,
  isAllDay,
  isBirthday,
  getDaysUntilChristmas,
} = require('./services');

//calendar
const getICS = async (SOCKET) => {
  let events = [];
  const webEvents = await ical.async
    .fromURL(ical_url)
    .catch((err) => console.log(err));
  for (let k in webEvents) {
    if (webEvents.hasOwnProperty(k)) {
      const ev = webEvents[k];
      if (webEvents[k].type == 'VEVENT') {
        if (webEvents[k].rrule) {
          const rule = webEvents[k].rrule;
          const after_dates = rule.after(new Date());
          if (!Array.isArray(after_dates) || after_dates !== null) {
            ev.start = after_dates;
          }
        }
        if (new Date(ev.start) >= new Date()) {
          const start = ev.start.toLocaleString().split(' ');
          start[0] = start[0].slice(0, -1);
          const end = ev.end.toLocaleString().split(' ');
          end[0] = end[0].slice(0, -1);
          const summary = ev.summary;

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
    holidays: [getDaysUntilChristmas()],
  };
  SOCKET.emit('getEvents', calendar);

  setTimeout(getICS.bind(null, SOCKET), pull_rate);
};

module.exports = {
  getICS,
};
