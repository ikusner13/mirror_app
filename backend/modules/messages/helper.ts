const calculateTimeTil = (hour: number) => {
  let now = new Date();
  let timeTil =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      0,
      0,
      0,
    ).valueOf() - now.valueOf();
  if (timeTil < 0) {
    timeTil += 86400000;
  }

  return timeTil;
};
const closestRefresh = (...times: number[]) => {
  const timesTil = times.map((hour) => {
    return calculateTimeTil(hour);
  });

  return Math.min(...timesTil);
};

export { calculateTimeTil, closestRefresh };
