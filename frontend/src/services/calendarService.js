import moment from 'moment'

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
    element.day = moment(element.start[0], 'M/D/YYYY').calendar(null, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      sameElse: function () {
        const startOfDayEvent = moment(element.start[0]).startOf('day')

        const startOfDayToday = moment().startOf('day')
        const diffDays = startOfDayEvent.diff(startOfDayToday, 'days')
        return `[In ${diffDays} days]`
      },
    })
    if (element.start[1] === element.end[1]) {
      element.allDay = true
    }
    if (isBirthday(element)) {
      element.birthday = true
    }
  })
  return newEvents
}

const isBirthday = (event) => {
  const summary = event.summary.toLowerCase()
  return summary.includes('birthday') || summary.includes('bday')
}

const getDaysUntilChristmas = () => {
  const startOfDayEvent = moment('12/25/2020', 'MM/DD/YYYY').startOf('day')
  const startOfDayToday = moment().startOf('day')
  const diffDays = startOfDayEvent.diff(startOfDayToday, 'days')
  return `${diffDays} days`
}

export { firstFive, getTime, getDaysUntilChristmas }
