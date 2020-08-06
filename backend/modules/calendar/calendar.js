const ical = require('ical')
const request = require('request')
const moment = require('moment')
// const { CALENDAR_PULL, ical_url } = require('./config')
const { ical_url, pull_rate } = require('../../../config/config').modules.find(
  (obj) => {
    return obj.module === 'calendar'
  },
).config
//calendar
const getICS = async (SOCKET) => {
  let events = []
  request(ical_url, (err, r, Rdata) => {
    const data = ical.parseICS(Rdata)

    const dataArr = Object.values(data)

    //get events that are upcoming in next 14 days
    //convert event times to local time
    events = dataArr.reduce(getUpcoming, []).map(({ start, end, summary }) => {
      let startLocal = start.toLocaleString().split(' ')
      let endLocal = end.toLocaleString().split(' ')

      startLocal[0] = startLocal[0].slice(0, -1)
      endLocal[0] = endLocal[0].slice(0, -1)

      return { startLocal, endLocal, summary }
    })

    //console.log('events', events)
    SOCKET.emit('getEvents', events)

    setTimeout(getICS.bind(null, SOCKET), pull_rate)
  })
}

const getUpcoming = (filter, obj) => {
  let newObj = []
  if (obj.type === 'VEVENT') {
    if (obj.rrule) {
      const rule = obj.rrule

      //get all upcoming recurring events within time frame
      const past = moment().startOf('day').toDate()
      const future = moment().add(14, 'd').toDate()
      rule.options.dtstart = past //fixes event from not showing up on current day
      let dates = rule.between(past, future, true)

      //if event is planned between 8pm and 12am EST, then rule.between will
      //change event to UTC, but wont adjust date correctly
      //so add 1 to date to offset this
      if (
        typeof dates[0] !== 'undefined' &&
        new Date(dates[0]).getUTCHours() < 4
      ) {
        dates.forEach((date) => {
          date = date.setUTCDate(date.getUTCDate() + 1)
        })
      }

      //sets events with proper start and end times
      newObj = dates.map((e) => {
        let start = moment(e).local().format('HH:mm')
        let end = moment(obj.end).local().format('HH:mm')

        const diff = timeDiff(start, end)

        //if all day event, add 1 day to start date
        //if other recurring event, add event duration to start time
        let endDate = obj.start.dateOnly
          ? moment.utc(e).add(1, 'd').format('YYYY-MM-DD')
          : moment
              .utc(e)
              .add(diff[0], 'hour')
              .add(diff[1], 'minute')
              .add(diff[2], 'second')
              .format('YYYY-MM-DD')
        const endTime = moment.utc(obj.end).format('HH:mm:ss')
        const UTCstring = `${endDate}T${endTime}.000Z`
        let endDateUTC = new Date(UTCstring)
        const newEvent = {
          start: e,
          end: endDateUTC,
          summary: obj.summary,
        }

        return newEvent
      })
    } else {
      newObj.push({ start: obj.start, end: obj.end, summary: obj.summary })
    }

    //if event hasnt happend or hasnt ended, then add
    newObj.forEach((element) => {
      //console.log(element)
      const parsed = new Date(Date.parse(element.end))
      if (parsed - Date.now() > 0) {
        //console.log(element)
        filter.push(element)
      }
    })
  }
  return filter.sort((a, b) => {
    return new Date(a.start) - new Date(b.start)
  })
}

// get difference between two times
// timeDiff(01:30, 13:45) -> [12,15]
const timeDiff = (start, end) => {
  start = start.split(':')
  end = end.split(':')

  let hour = end[0] - start[0] < 0 ? end[0] - start[0] + 24 : end[0] - start[0]

  let minute
  if (end[1] - start[1] < 0) {
    minute = end[1] - start[1] + 60
    hour = hour - 1
  } else {
    minute = end[1] - start[1]
  }
  const result = [hour, minute]
  return result
}

module.exports = {
  getICS,
}
