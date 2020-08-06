const moment = require('moment')
const thanksgiving = () => {
  const year = moment().year()
  const month = 10

  const november = moment({ year: year, month: month })

  const firstThursday = november.weekday(4)

  let weeks = 3
  if (firstThursday.month() !== month) {
    weeks++
  }

  return firstThursday.add(weeks, 'weeks').format('MM-DD')
}
const Messages = {
  anyTime: [
    'I love you',
    'Hey there sexy',
    'Hello Paige',
    'You look beautiful',
    "You're a boob",
    'What a sweetheart',
    'Sweetheart',
    "You're a cutie",
    "Are you from Tennessee? Because you're the only 10 I see",
    'My princess',
    "I hope you're having a good day",
    'Hello',
    'Hey there',
    "If you were a chicken you'd be impeccable",
    "Did you just come out of the oven? Because you're hot",
    "You're so sweet, you're giving me a toothache",
    'Is it hot in here? Or is it just you',
    'Did you have lucky charms for breakfast? Because you look magically delicious',
    'Nice legs',
    'Hey there beautiful',
    'Hey girl, are you Himalayan cuz I wanna see your Nepals',
  ],
  morning: [
    'Good morning',
    'I hope you slept well',
    'How did you sleep?',
    'Enjoy your day',
    'Good morning sunshine',
  ],
  evening: ['Goodnight', 'Sleep well', 'Sweet dreams'],
  holidays: {
    '01-01': 'Happy New Years!',
    '02-14': 'Happy Valentines day!',
    '07-24': 'Happy Aniversary!',
    '07-29': 'Happy Birthday!',
    '10-31': 'Happy Halloween!',
    '12-24': 'Merry Christmas Eve',
    '12-25': 'Merry Christmas!',
    '12-31': 'Happy New Years Eve!',
    [thanksgiving()]: 'Happy Thanksgiving!',
  },
}

module.exports = {
  Messages,
}
