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
const TOKEN_PATH = __dirname + '/token.json'
const CALL_TIME = calculateTimeTil(0)
const scopes = [
  'https://www.googleapis.com/auth/photoslibrary',
  'https://www.googleapis.com/auth/photoslibrary.sharing',
]
module.exports = {
  TOKEN_PATH,
  CALL_TIME,
  scopes,
}
