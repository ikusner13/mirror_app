const ical = require('ical')
const request = require('request')
const moment = require('moment')
const { ical_url, pull_rate } = require('../../../config/config').modules.find(
  (obj) => {
    return obj.module === 'calendar'
  },
).config
//calendar
const getICS = async (SOCKET) => {
  let events = []
  request(ical_url, (err, r, Rdata) => {
    if (err) return console.error(err)
    const data = ical.parseICS(Rdata)

    const dataArr = Object.values(data)

    //get events that are upcoming in next 14 days
    //convert event times to local time
    //console.log('dataArr', dataArr)
    events = dataArr.reduce(getUpcoming, []).map(({ start, end, summary }) => {
      console.log('start', start)
      console.log('end', end)
      let startLocal = start.toLocaleString().split(' ')
      let endLocal = end.toLocaleString().split(' ')
      //if timezone offset is 5, then add hour
      console.log('start', moment(start).add(1, 'hours'))

      let d = new Date()
      console.log(d.getTimezoneOffset())

      startLocal[0] = startLocal[0].slice(0, -1)
      endLocal[0] = endLocal[0].slice(0, -1)

      return { startLocal, endLocal, summary }
    })
    //console.log('return', events)
    SOCKET.emit('getEvents', events)

    setTimeout(getICS.bind(null, SOCKET), pull_rate)
  })
}

const getUpcoming = (filter, obj) => {
  if (obj.type === 'VEVENT') {
    if (obj.rrule) {
      const rule = obj.rrule
      //get all upcoming recurring events within time frame
      const past = moment().startOf('day').toDate()
      const future = moment().add(9, 'd').toDate()
      rule.options.dtstart = past //fixes event from not showing up on current day
      let dates = rule.between(past, future, true)

      console.log('dates', dates)

      //if event is planned between 8pm and 12am EST, then rule.between will
      //change event to UTC, but wont adjust date correctly
      //so add 1 to date to offset this
      // /todo: make map into dates.filter().map()

      //sets events with proper start and end times
      if (dates.length > 0) {
        dates
          .filter((date) => {
            const endDateUTC = endTime(date, obj)
            return new Date(Date.parse(endDateUTC)) - Date.now() > 0
          })
          .forEach((e) => {
            // console.log('e', e)
            const endDateUTC = endTime(e, obj)
            const newEvent = {
              start: e,
              end: endDateUTC,
              summary: obj.summary,
            }

            console.log('new event', newEvent)

            filter.push(newEvent)
          })
      }
    } else {
      const now = Date.now()
      const future = moment().add(7, 'days').toDate()
      const start = new Date(Date.parse(obj.start))
      const end = new Date(Date.parse(obj.end))

      if (start < future && end - now > 0) {
        filter.push({ start: obj.start, end: obj.end, summary: obj.summary })
      }
    }
    //if event hasnt happend or hasnt ended, then add
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
  let hour = end[0] - start[0] <= 0 ? end[0] - start[0] + 24 : end[0] - start[0]

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
const endTime = (event, firstEvent) => {
  let start = moment(event).local().format('HH:mm')
  let end = moment(firstEvent.end).local().format('HH:mm')

  const diff = timeDiff(start, end)

  //if all day event, add 1 day to start date
  //if other recurring event, add event duration to start time
  let endDate = moment
    .utc(event)
    .add(diff[0], 'hour')
    .add(diff[1], 'minute')
    .format('YYYY-MM-DD')
  const endTime = moment.utc(firstEvent.end).format('HH:mm:ss')
  const UTCstring = `${endDate}T${endTime}.000Z`
  let endDateUTC = new Date(UTCstring)
  return endDateUTC
}
// getICS(0)
module.exports = {
  getICS,
}
