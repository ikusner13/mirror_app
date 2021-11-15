const { messages } = require('./messageList')
const helper = require('./helper')
const { defaults } = require('../../../config/config').modules.find((obj) => {
  return obj.module === 'message'
}).config
const dayjs = require('dayjs')

messages['lastMorningIndex'] = -1
messages['lastAfternoonIndex'] = -1
messages['lastEveningIndex'] = -1

const getRandomMessage = (set, key) => {
  let randomMessage = Math.floor(Math.random() * set.length)

  while (randomMessage === messages[key]) {
    randomMessage = Math.floor(Math.random() * set.length)
  }
  messages[key] = randomMessage

  return set[randomMessage]
}

const currentSet = () => {
  const hour = dayjs().hour()

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
  const date = dayjs().format('MM-DD').toString()

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
