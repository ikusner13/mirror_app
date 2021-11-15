const { messages } = require('../../../config/config').modules.find((obj) => {
  return obj.module === 'message'
}).config
const dayjs = require('dayjs')
const weekday = require('dayjs/plugin/weekday')
const objectSupport = require('dayjs/plugin/objectSupport')
dayjs.extend(objectSupport)
dayjs.extend(weekday)

const thanksgiving = () => {
  const year = dayjs().year()
  const month = 10
  const november = dayjs({ year: year, month: month })
  const firstThursday = november.weekday(4)

  let weeks = 3
  if (firstThursday.month() !== month) {
    weeks++
  }

  return firstThursday.add(weeks, 'week').format('MM-DD')
}
const holiday = {
  '01-01': 'Happy New Years!',
  '02-14': 'Happy Valentines day!',
  '07-24': 'Happy Aniversary!',
  '07-29': 'Happy Birthday!',
  '10-31': 'Happy Halloween!',
  '12-24': 'Merry Christmas Eve',
  '12-25': 'Merry Christmas!',
  '12-31': 'Happy New Years Eve!',
  [thanksgiving()]: 'Happy Thanksgiving!',
}
messages.holidays = holiday
module.exports = {
  messages,
}
