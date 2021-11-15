//const moment = require('moment')
const dayjs = require('dayjs')
var calendar = require('dayjs/plugin/calendar')
dayjs.extend(calendar)

const firstFive = (events) => {
  let newArr = events
  if (events.length > 5) {
    newArr = events.splice(0, 5)
  }
  newArr = getTime(newArr)
  return newArr
}

const getTime = (events) => {
  const newEvents = [...events]
  newEvents.forEach((element) => {
    element.day = dayjs(element.start[0], 'M/D/YYYY').calendar(null, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      sameElse: function () {
        const startOfDayEvent = dayjs(element.start[0]).startOf('day')

        const startOfDayToday = dayjs().startOf('day')
        const diffDays = startOfDayEvent.diff(startOfDayToday, 'days')
        return `In ${diffDays} days`
      },
    })
  })
  return newEvents
}

const isAllDay = (start, end) => {
  const startTime = start[1]
  const startPeriod = start[2]

  const endTime = end[1]
  const endPeriod = end[2]

  if (startTime === endTime && startPeriod === endPeriod) {
    return true
  }
  return false
}

const isBirthday = (eventSummary) => {
  const summary = eventSummary.toLowerCase()
  return summary.includes('birthday') || summary.includes('bday')
}

const getDaysUntilChristmas = () => {
  const today = new Date()
  const cmas = new Date(today.getFullYear(), 11, 25)
  if (today.getMonth() == 11 && today.getDate() > 25) {
    cmas.setFullYear(cmas.getFullYear() + 1)
  }
  const one_day = 1000 * 60 * 60 * 24
  const daysTill = Math.ceil((cmas.getTime() - today.getTime()) / one_day)
  return `${daysTill} days left until Christmas!`
}

module.exports = { firstFive, isAllDay, isBirthday, getDaysUntilChristmas }
