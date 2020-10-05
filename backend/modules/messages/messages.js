const { messages } = require('./messageList')
const moment = require('moment')
const helper = require('./helper')
const { defaults } = require('../../../config/config').modules.find((obj) => {
  return obj.module === 'message'
}).config

messages['lastMorningIndex'] = -1
messages['lastAfternoonIndex'] = -1
messages['lastEveningIndex'] = -1

const getRandomMessage = (set, key) => {
  console.log('timeIndex', messages[key])
  let randomMessage = Math.floor(Math.random() * set.length)

  while (randomMessage === messages[key]) {
    randomMessage = Math.floor(Math.random() * set.length)
  }
  messages[key] = randomMessage

  return set[randomMessage]
}

const currentSet = () => {
  const hour = moment().hour()

  if (hour >= defaults.morningStart && hour < defaults.morningEnd) {
    return getRandomMessage(messages.morning, 'lastMorningIndex')
  } else if (
    hour >= defaults.nightStart ||
    (hour >= 0 && hour < defaults.morningStart)
  ) {
    return getRandomMessage(messages.evening, 'lastEveningIndex')
  } else {
    return getRandomMessage(messages.anyTime, 'lastAfternoonIndex')
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
  console.log('new message', moment().format())
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
  console.log('time', new Date(new Date().getTime() + time).toLocaleString())
  setTimeout(getMessages.bind(null, socket), 5000)
}

// getMessages(0)

module.exports = {
  getMessages,
}
