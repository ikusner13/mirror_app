const { google } = require('googleapis')
const fs = require('fs').promises
const moment = require('moment')
const { calculateTimeTil } = require('./helpers')
const { token_path } = require('../../../config/config').modules.find((obj) => {
  return obj.module === 'googlePhotos'
}).config
const { getAlbum } = require('./getPhoto')
const { createToken } = require('./createToken')
let CALL_TIME = 0

const googlePhotos = async () => {
  const credentials = await getAuthDetails()

  const oAuth2Client = await setCredentials(credentials)

  //console.log(oAuth2Client)
  const url = await getAlbum(oAuth2Client)
  console.log(url)
}

const getAuthDetails = async () => {
  const data = await fs.readFile(__dirname + '/auth.json')
  const content = JSON.parse(data)
  //console.log('data', content)
  return content
}
const setCredentials = async (creds) => {
  //console.log('creds', creds)
  const { client_id, client_secret, redirect_uris } = creds.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  )
  const tokens = await fs.readFile(__dirname + token_path)
  oAuth2Client.setCredentials(JSON.parse(tokens))
  return oAuth2Client
}

googlePhotos()
module.exports = {
  googlePhotos,
}
