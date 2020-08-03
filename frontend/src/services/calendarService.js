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
  //console.log('events', events)
  const newEvents = [...events]
  //console.log(events)
  newEvents.forEach((element) => {
    element.day = moment(element.startLocal[0], 'M/D/YYYY').calendar(null, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      sameElse: function () {
        const startOfDayEvent = moment(element.startLocal[0]).startOf('day')

        const startOfDayToday = moment().startOf('day')
        //console.log(moment(element.startLocal[0]).endOf('day').fromNow())
        const fromNow = moment(element.startLocal[0]).endOf('day').fromNow()
        const diffDays = startOfDayEvent.diff(startOfDayToday, 'days')
        return `[In ${diffDays} days]`
      },
    })
    if (element.startLocal[1] === element.endLocal[1]) {
      element.allDay = true
    }
  })
  //console.log(newEvents)
  return newEvents
}

export { firstFive, getTime }
/*if (element.startLocal[0] === today) {
            element.day = "today"
        }
        else if (element.startLocal[0] === tommorrow.format('MM/DD/YYYY')) {
            element.day = "tomorrow"
        }
        else {
            const eventDate = moment(element.startLocal[0])
            const dayUntil = eventDate.diff(moment(), 'days')
            element.day = dayUntil
        }*/
