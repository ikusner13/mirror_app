const {
  modules: {
    message: { messages },
  },
} = require('../../../../config/config');
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import objectSupport from 'dayjs/plugin/objectSupport';

dayjs.extend(objectSupport);
dayjs.extend(weekday);

type Holidays = { [date: string]: string };

interface Messages {
  anyTime: string[];
  morning: string[];
  evening: string[];
  holidays: Holidays;
}

const messagesList: Messages = { ...messages };

const thanksgiving = () => {
  const year = dayjs().year();
  const month = 10;
  // @ts-ignore - type issue with dayjs and objectSupport plugin
  const november = dayjs({ year: year, month: month, date: 0 });
  const firstThursday = november.weekday(4);

  const weeks = firstThursday.month() !== month ? 4 : 3;

  return firstThursday.add(weeks, 'week').format('MM-DD');
};

const holiday: Holidays = {
  '01-01': 'Happy New Years!',
  '02-14': 'Happy Valentines day!',
  '07-24': 'Happy Anniversary!',
  '07-29': 'Happy Birthday!',
  '10-31': 'Happy Halloween!',
  '12-24': 'Merry Christmas Eve',
  '12-25': 'Merry Christmas!',
  '12-31': 'Happy New Years Eve!',
  [thanksgiving()]: 'Happy Thanksgiving!',
};
messagesList.holidays = holiday;

export default messagesList;
