const SpotifyWebApi = require('spotify-web-api-node')

const { spotify } = require('../config')

//SPOTIFY SETUP
var client_id = spotify.client_id // Your client id
var client_secret = spotify.client_secret // Your secret
var redirect_uri = spotify.redirect_uri
const access_token = spotify.access_token
const refresh_token = spotify.refresh_token

const spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri,
})

let tokenExpirationEpoch = new Date().getTime() / 1000 + 3600

spotifyApi.setAccessToken(access_token)
spotifyApi.setRefreshToken(refresh_token)

const config = {
  CURRENT_PULL: 3000,
  MIN_PULL: 3000,
}

const setNowPlaying = async (SOCKET) => {
  spotifyApi
    .getMyCurrentPlaybackState({})
    .then((result) => {
      config.CURRENT_PULL = config.MIN_PULL
      //if body return something (is playing)
      if (Object.keys(result.body).length > 0) {
        SOCKET.emit('getPlayBackState', sendablePayload(result.body))
        calls = 0
      }
      // isn't playing or has been paused for too long
      else {
        SOCKET.emit('getPlayBackState', { noSong: true })
      }
    })
    .catch((error) => {
      console.error(error)
      if (error.message === 'Unauthorized') {
        refresh()
      } else {
        config.CURRENT_PULL =
          config.CURRENT_PULL < 5000 ? config.CURRENT_PULL + 1000 : 5000
      }
    })

  setTimeout(setNowPlaying.bind(null, SOCKET), config.CURRENT_PULL)
}

const getImgUrl = (images) => {
  let filtered = images.filter((image) => {
    return image.width >= 240 && image.width <= 350
  })
  return filtered[0].url
}

const getArtists = (artists) => {
  return artists
    .map((artist) => {
      return artist.name
    })
    .join(', ')
}

const sendablePayload = (songInfo) => {
  const payload = {
    imgURL: getImgUrl(songInfo.item.album.images),
    songTitle: songInfo.item.name,
    artist: getArtists(songInfo.item.artists),
    album: songInfo.item.album.name,
  }
  return payload
}

const refresh = async () => {
  try {
    const newToken = await spotifyApi.refreshAccessToken()
    spotifyApi.setAccessToken(newToken.body['access_token'])
    tokenExpirationEpoch =
      new Date().getTime() / 1000 + newToken.body['expires_in']
    /*console.log(
            'Refreshed token. It now expires in ' +
            Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
            ' seconds!'
        );*/
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = {
  setNowPlaying,
}
