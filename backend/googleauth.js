const express = require('express')
const app = express()
const axios = require('axios')
const { google } = require('googleapis')
const cors = require('cors')
const opn = require('open')
const auth = require('./auth.json')
const readLine = require('readline')
const config = {
  client_id: auth.installed.client_id,
  client_secret: auth.installed.client_secret,
  redirect_url: auth.installed.redirect_uris[0],
}

let tokens

const oauth2Client = new google.auth.OAuth2(
  config.client_id,
  config.client_secret,
  config.redirect_url,
)

const scopes = [
  'https://www.googleapis.com/auth/photoslibrary',
  'https://www.googleapis.com/auth/photoslibrary.sharing',
]

const authenticate = () => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',

    scope: scopes,
  })
  console.log('opening Oauth url')
  opn(url).catch(() => {
    console.log('failed to open url')
    console.log('url ', url)
  })
  const reader = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })
  reader.question('>Paste your code: ', processTokens)
}

const processTokens = (code) => {
  oauth2Client.getToken(code, (err, t) => {
    if (err) throw new Error('Error getting tokens:', error)
    tokens = t
    oauth2Client.credentials = t
    console.log('t', oauth2Client.credentials)
    console.log(google.getSupportedAPIs())
  })
  /*process.nextTick(() => {
    process.exit()
  })*/
}

authenticate()
