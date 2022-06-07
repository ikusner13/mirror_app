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
const randPhoto = (photos: string[], lastPhotos: number[]) => {
  const index = lastPhotos[Math.floor(Math.random() * lastPhotos.length)];
  return photos[index];
};

export { calculateTimeTil, randPhoto };
