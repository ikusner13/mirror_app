const { messages } = require('./messageList')
const moment = require('moment')
const helper = require('./helper')

const defaults = {
  morningStart: 8,
  morningEnd: 9,
  nightStart: 22,
  nightEnd: 8,
}
const getRandomMessage = (messages) => {
  const length = messages.length - 1
  let randomMessage = Math.floor(Math.random() * length)

  return messages[randomMessage]
}

const currentSet = () => {
  const hour = moment().hour()

  if (hour >= defaults.morningStart && hour < defaults.morningEnd) {
    return getRandomMessage(messages.morning)
  } else if (
    hour >= defaults.nightStart ||
    (hour >= 0 && hour < defaults.nightEnd)
  ) {
    return getRandomMessage(messages.evening)
  } else {
    return getRandomMessage(messages.anyTime)
  }
}

const getHoliday = () => {
  const date = moment().format('MM-DD').toString()

  if (messages.holidays.hasOwnProperty(date)) {
    return messages.holidays[date]
  }
  return null
}

const getMessages = (socket) => {
  if (getHoliday() !== null) {
    const holiday = getHoliday()
    socket.emit('message', holiday)
  } else {
    const set = currentSet()
    socket.emit('message', set)
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
