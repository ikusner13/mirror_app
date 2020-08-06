const { Messages } = require('./messageList')
const moment = require('moment')
const helper = require('./helper')

const defaults = {
  morningStart: 5,
  morningEnd: 12,
  nightStart: 22,
  nightEnd: 5,
}
const getRandomMessage = (messages) => {
  const length = messages.length - 1
  let randomMessage = Math.floor(Math.random() * length)

  return messages[randomMessage]
}

const currentSet = () => {
  const hour = moment().hour()

  if (hour >= defaults.morningStart && hour < defaults.morningEnd) {
    return getRandomMessage(Messages.morning)
  } else if (
    hour >= defaults.nightStart ||
    (hour >= 0 && hour < defaults.nightEnd)
  ) {
    return getRandomMessage(Messages.evening)
  } else {
    return getRandomMessage(Messages.anyTime)
  }
}

const getHoliday = () => {
  const date = moment().format('MM-DD').toString()

  if (Messages.holidays.hasOwnProperty(date)) {
    return Messages.holidays[date]
  }
  return null
}

const getMessages = (socket) => {
  if (getHoliday() !== null) {
    const holiday = getHoliday()
    socket.emit('message', holiday)
    console.log(holiday)
  } else {
    const set = currentSet()
    socket.emit('message', set)
    console.log(set)
  }

  let time = helper.closestRefresh(
    defaults.morningStart,
    defaults.morningEnd,
    defaults.nightStart,
  )
  setTimeout(getMessages.bind(null, socket), time)
}

// getMessages(0)

module.exports = {
  getMessages,
}
