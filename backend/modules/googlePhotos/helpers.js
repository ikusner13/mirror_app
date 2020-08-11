const calculateTimeTil = (hour) => {
  let now = new Date()
  let timeTil =
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0, 0) -
    now
  if (timeTil < 0) {
    timeTil += 86400000
  }

  return timeTil
}
const randPhoto = (photos, lastPhoto) => {
  const photo = photos[Math.floor(Math.random() * photos.length)]
  return photo === lastPhoto ? randPhoto(photos, lastPhoto) : photo
}

module.exports = {
  calculateTimeTil,
  randPhoto,
}
