const {
  modules: {
    message: { config },
  },
} = require('../../../../config/config');
import messages from './messageList';
import { closestRefresh } from './helper';
import dayjs from 'dayjs';
import Module from '../module';

type indexKey = 'lastMorningIndex' | 'lastAfternoonIndex' | 'lastEveningIndex';

interface Defaults {
  morningStart: number;
  morningEnd: number;
  afternoon2: number;
  nightStart: number;
}

interface LastIndexes {
  lastMorningIndex: number;
  lastAfternoonIndex: number;
  lastEveningIndex: number;
}

const defaults: Defaults = config;

class Message extends Module {
  private _lastMessageIndexes: LastIndexes = {
    lastMorningIndex: -1,
    lastAfternoonIndex: -1,
    lastEveningIndex: -1,
  };

  public getMessages = () => {
    console.log('GET MESSAGES');
    const holiday = this.getHoliday();

    if (holiday) {
      this.sendSocketEvent('message', holiday);
    } else {
      const set = this.currentSet();
      // eslint-disable-next-line no-console
      console.log(
        `🦄 ${Date.now().toString()} set: ${JSON.stringify(set, null, 4)}`,
      );
      this.sendSocketEvent('message', set);
    }

    let time = closestRefresh(
      defaults.morningStart,
      defaults.afternoon2,
      defaults.morningEnd,
      defaults.nightStart,
    );

    setTimeout(this.getMessages, time);
  };

  private getRandomMessage = (set: string[], key: indexKey) => {
    let randomMessage = Math.floor(Math.random() * set.length);

    while (randomMessage === this._lastMessageIndexes[key]) {
      randomMessage = Math.floor(Math.random() * set.length);
    }

    this._lastMessageIndexes[key] = randomMessage;

    return set[randomMessage];
  };

  private currentSet = () => {
    const hour = dayjs().hour();

    if (hour >= defaults.morningStart && hour < defaults.morningEnd) {
      return this.getRandomMessage(messages.morning, 'lastMorningIndex');
    } else if (
      hour >= defaults.nightStart ||
      (hour >= 0 && hour < defaults.morningStart)
    ) {
      return this.getRandomMessage(messages.evening, 'lastEveningIndex');
    } else {
      return this.getRandomMessage(messages.anyTime, 'lastAfternoonIndex');
    }
  };

  private getHoliday = () => {
    const date = dayjs().format('MM-DD').toString();

    if (messages.holidays.hasOwnProperty(date)) {
      return messages.holidays[date];
    }
    return null;
  };
}

export default Message;
