const { google } = require('googleapis')
const cors = require('cors')
const opn = require('open')
const auth = require('./auth.json')
const readLine = require('readline')
const fs = require('fs')
const fetch = require('node-fetch')

/*const config = {
  client_id: auth.installed.client_id,
  client_secret: auth.installed.client_secret,
  redirect_url: auth.installed.redirect_uris[0],
}*/

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

const TOKEN_PATH = 'token.json'

const CALL_TIME = calculateTimeTil(0)

const scopes = [
  'https://www.googleapis.com/auth/photoslibrary',
  'https://www.googleapis.com/auth/photoslibrary.sharing',
]

fs.readFile('auth.json', (err, content) => {
  if (err) return console.log('Error loading client file:', err)
  authorize(JSON.parse(content), getPhotos)
})

const authorize = (creds, callback) => {
  console.log('creds', creds)
  console.log('callback', callback)
  //console.log('authorize')
  const { client_id, client_secret, redirect_uris } = creds.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  )
  oAuth2Client.on('tokens', (tokens) => {
    /*fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), (err) => {
      if (err) return console.error('err')
      console.log('Token stored to', TOKEN_PATH)
    })*/
    console.log('token on ', tokens)
  })

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      return getAccessToken(oAuth2Client, callback)
    }
    oAuth2Client.setCredentials(JSON.parse(token))
    if (oAuth2Client.credentials.expiry_date < Date.now()) {
      console.log('refresh')
      oAuth2Client.refreshAccessToken().then((tk) => {
        //console.log('tk', tk.credentials)
        const tokens = tk.credentials
        fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), (err) => {
          if (err) return console.error('err')
          console.log('Token stored to', TOKEN_PATH)
        })
        callback(oAuth2Client)
      })
    } else {
      //console.log('creds', oAuth2Client.credentials.access_token)
      callback(oAuth2Client)
    }
  })

  //console.log('creds', creds)
  setTimeout(authorize.bind(null, creds, callback), CALL_TIME)
}

const getAccessToken = (oAuth2Client, callback) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  })
  opn(authUrl).catch(() => {
    console.log('failed to open url')
    console.log('url ', authUrl)
  })
  const r1 = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  r1.question('Enter the code from url here ', (code) => {
    r1.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err)
      //console.log(token)
      oAuth2Client.setCredentials(token)
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error('err')
        console.log('Token stored to', TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

const getPhotos = async (auth) => {
  const body = {
    pageSize: 100,
    albumId:
      'AKcvZRwngYxfEg0WthniYt7tZG4BW3m5JKYYQGWUu7XNlFmTDcgqGqeK36lh1fF_AuOUTk01MAjc',
  }
  let photoUrls = []
  try {
    const res = await fetch(
      'https://photoslibrary.googleapis.com/v1/mediaItems:search',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.credentials.access_token,
        },
        body: JSON.stringify(body),
      },
    )
    const photos = await res.json()
    if (photos.mediaItems) {
      photos.mediaItems.forEach((element) => {
        photoUrls.push(element.baseUrl)
      })
    }
    //console.log('photos', photos)
    //console.log('photo urls', photoUrls.length)
    const url = randPhoto(photoUrls)
    console.log(url)
  } catch (error) {
    console.log(error)
  }
}

const randPhoto = (photos) => {
  const photo = photos[Math.floor(Math.random() * photos.length)]
  return photo
}
