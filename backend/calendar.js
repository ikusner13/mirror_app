const ical = require('ical')
const request = require('request')
const moment = require('moment')

//calendar
const ical_uri =
  'https://calendar.google.com/calendar/ical/splgvglb55q2kpbnjbsrab75f4%40group.calendar.google.com/private-928abe1b658ce5021f7b473cef3a6faf/basic.ics'
const getICS = async () => {
  let events = []
  request(ical_uri, (err, r, Rdata) => {
    const data = ical.parseICS(Rdata)

    const dataArr = Object.values(data)

    events = dataArr.reduce(getUpcoming, []).map(({ start, end, summary }) => {
      let startLocal = start.toLocaleString().split(' ')
      let endLocal = end.toLocaleString().split(' ')

      startLocal[0] = startLocal[0].slice(0, -1)
      endLocal[0] = endLocal[0].slice(0, -1)

      return { startLocal, endLocal, summary }
    })

    console.log('events', events)
    config.SOCKET.emit('getEvents', events)

    setTimeout(getICS, config.CALENDAR_PULL)
  })
}

const getUpcoming = (filter, obj) => {
  let newObj = []
  if (obj.type === 'VEVENT') {
    if (obj.rrule) {
      const rule = obj.rrule
      const past = moment().startOf('day').toDate()
      const future = moment().add(14, 'd').toDate()

      rule.options.dtstart = past
      let dates = rule.between(past, future, true)

      if (
        typeof dates[0] !== 'undefined' &&
        new Date(dates[0]).getUTCHours() < 4
      ) {
        dates.forEach((date) => {
          date = date.setUTCDate(date.getUTCDate() + 1)
        })
      }

      newObj = dates.map((e) => {
        let start = moment(e).local().format('HH:mm')
        let end = moment(obj.end).local().format('HH:mm')

        const diff = timeDiff(start, end)
        console.log(diff)
        //console.log(moment(e).local().format('HH:mm'))
        let endDate = obj.start.dateOnly
          ? moment.utc(e).add(1, 'd').format('YYYY-MM-DD')
          : moment
              .utc(e)
              .add(diff[0], 'hour')
              .add(diff[1], 'minute')
              .add(diff[2], 'second')
              .format('YYYY-MM-DD')
        //console.log('endDate', endDate)
        //console.log('start', e)
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
