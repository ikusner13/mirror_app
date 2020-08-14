const { google } = require('googleapis')
const opn = require('open')
const readLine = require('readline')
const fs = require('fs')
const fetch = require('node-fetch')
const moment = require('moment')
const { randPhoto, calculateTimeTil } = require('./helpers')
const {
  token_path,
  scopes,
  albumTitle,
} = require('../../../config/config').modules.find((obj) => {
  return obj.module === 'googlePhotos'
}).config
let CALL_TIME = 0
let lastPhotos = []
let albumLength = 0
const googlePhotos = (socket) => {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms))

  fs.readFile(__dirname + '/auth.json', (err, content) => {
    if (err) return console.log('Error loading client file:', err)
    authorize(JSON.parse(content), getAlbum)
  })

  const authorize = (creds, callback) => {
    const { client_id, client_secret, redirect_uris } = creds.installed
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    )

    fs.readFile(__dirname + token_path, (err, token) => {
      if (err) {
        return getAccessToken(oAuth2Client, callback)
      }
      oAuth2Client.setCredentials(JSON.parse(token))
      if (oAuth2Client.credentials.expiry_date < Date.now()) {
        oAuth2Client.refreshAccessToken().then((tk) => {
          const tokens = tk.credentials
          fs.writeFile(
            __dirname + token_path,
            JSON.stringify(tokens),
            (err) => {
              if (err) return console.error('err')
              console.log('Token stored to', token_path)
            },
          )
          callback(oAuth2Client)
        })
      } else {
        callback(oAuth2Client)
      }
    })

    let nextHour = moment().add(1, 'hour').hour()
    CALL_TIME = calculateTimeTil(nextHour)
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
        oAuth2Client.setCredentials(token)
        fs.writeFile(__dirname + token_path, JSON.stringify(token), (err) => {
          if (err) return console.error('err')
          console.log('Token stored to', token_path)
        })
        callback(oAuth2Client)
      })
    })
  }

  const getAlbum = async (auth) => {
    try {
      const album = await fetch(
        'https://photoslibrary.googleapis.com/v1/albums',
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth.credentials.access_token,
          },
        },
      )
      let data = await album.json()
      const albums = data.albums
      if (Array.isArray(albums)) {
        for (let album of albums) {
          if (album.title === albumTitle) {
            return getPhotosFromAlbum(auth, album.id)
          }
        }
      }
      if (data.nextPageToken) {
        await delay(500)
        getAlbum(auth)
      } else {
        console.log('albums', albums)
        return console.log('no matching albums')
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const getPhotosFromAlbum = async (auth, albumId) => {
    let photoUrls = []
    const fetchPhotos = async (pageToken = '') => {
      let body = {
        pageSize: '100',
        pageToken,
        albumId,
      }
      //const params = new URLSearchParams(body)

      const url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search'
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.credentials.access_token,
        },
        body: JSON.stringify(body),
      })

      const photos = await res.json()

      if (photos.mediaItems) {
        photos.mediaItems.forEach((element) => {
          photoUrls.push(element.baseUrl)
        })
      }

      if (photos.nextPageToken) {
        await delay(500)
        fetchPhotos(photos.nextPageToken)
      } else {
        if (lastPhotos.length === 0) {
          for (let i = 0; i < photoUrls.length; i++) {
            lastPhotos.push(i)
          }
          albumLength = photoUrls.length
        }
        if (albumLength !== photoUrls.length) {
          if (albumLength < photoUrls.length) {
            for (let i = albumLength; i < photoUrls.length; i++) {
              lastPhotos.push(i)
            }
          } else {
            lastPhotos.length = 0
            for (let i = 0; i < photoUrls.length; i++) {
              lastPhotos.push(i)
            }
          }
          albumLength = photoUrls.length
        }
        const url = randPhoto(photoUrls, lastPhotos)
        const PhotoUrlsIndex = photoUrls.indexOf(url)

        const lastPhotosIndex = lastPhotos.indexOf(PhotoUrlsIndex)
        if (lastPhotosIndex > -1) {
          lastPhotos.splice(lastPhotosIndex, 1)
        }
        socket.emit('googlePhotos', url)
      }
    }
    fetchPhotos()
  }
}
// googlePhotos(0)
module.exports = {
  googlePhotos,
}
