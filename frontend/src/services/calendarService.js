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
    element.day = moment(element.startLocal[0], 'M/D/YYYY').calendar(null, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      sameElse: function () {
        const startOfDayEvent = moment(element.startLocal[0]).startOf('day')

        const startOfDayToday = moment().startOf('day')
        const diffDays = startOfDayEvent.diff(startOfDayToday, 'days')
        return `[In ${diffDays} days]`
      },
    })
    if (element.startLocal[1] === element.endLocal[1]) {
      element.allDay = true
    }
  })
  return newEvents
}

export { firstFive, getTime }
