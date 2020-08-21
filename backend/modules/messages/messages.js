const { messages } = require('./messageList')
const moment = require('moment')
const helper = require('./helper')

const defaults = {
  morningStart: 8,
  morningEnd: 9,
  afternoon2: 5,
  nightStart: 22,
}
const getRandomMessage = (messages) => {
  let randomMessage = Math.floor(Math.random() * messages.length)
  console.log(messages.length)

  return messages[randomMessage]
}

const currentSet = () => {
  const hour = moment().hour()

  if (hour >= defaults.morningStart && hour < defaults.morningEnd) {
    return getRandomMessage(messages.morning)
  } else if (
    hour >= defaults.nightStart ||
    (hour >= 0 && hour < defaults.morningStart)
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
    defaults.afternoon2,
    defaults.morningEnd,
    defaults.nightStart,
  )
  setTimeout(getMessages.bind(null, socket), time)
}

// getMessages(0)

module.exports = {
  getMessages,
}
