import dayjs from 'dayjs';

export default {
  info: (message: string) => {
    console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')} - INFO - ${message}`);
  },
  error: (message: string) => {
    console.log(
      `${dayjs().format('YYYY-MM-DD HH:mm:ss')} - ERROR - ${message}`,
    );
  },
};
