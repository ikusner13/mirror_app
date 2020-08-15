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
const randPhoto = (photos, lastPhotos) => {
  const index = lastPhotos[Math.floor(Math.random() * lastPhotos.length)]
  return photos[index]
}

module.exports = {
  calculateTimeTil,
  randPhoto,
}
