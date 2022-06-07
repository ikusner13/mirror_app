import SpotifyWebApi from 'spotify-web-api-node';
// const config = require('../../../config/config')
// const spotify = config.modules.find((obj) => {
//   return obj.module === 'spotify'
// }).config
import dayjs from 'dayjs';
import { Socket } from 'socket.io';
import Module from '../module';

const spotify = {
  client_id: '',
  client_secret: '',
  redirect_uri: '',
  access_token: '',
  refresh_token: '',
};

//SPOTIFY SETUP
var client_id = spotify.client_id; // Your client id
var client_secret = spotify.client_secret; // Your secret
var redirect_uri = spotify.redirect_uri;
const access_token = spotify.access_token;
const refresh_token = spotify.refresh_token;

const spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri,
});

let tokenExpirationEpoch = dayjs();

spotifyApi.setAccessToken(access_token);
spotifyApi.setRefreshToken(refresh_token);

const MIN_PULL = 3000;
let CURRENT_PULL = MIN_PULL;

class Spotify extends Module {
  setNowPlaying = async (SOCKET: any) => {
    if (dayjs().isBefore(tokenExpirationEpoch)) {
      spotifyApi
        .getMyCurrentPlaybackState({})
        .then((result) => {
          CURRENT_PULL = MIN_PULL;
          //if body return something (is playing)
          if (Object.keys(result.body).length > 0) {
            SOCKET.emit('getPlayBackState', sendablePayload(result.body));
          }
          // isn't playing or has been paused for too long
          else {
            SOCKET.emit('getPlayBackState', { noSong: true });
          }
        })
        .catch((error) => {
          if (error.message === 'Unauthorized') {
            refresh();
          } else {
            CURRENT_PULL = CURRENT_PULL < 5000 ? CURRENT_PULL + 1000 : 5000;
          }
        });
    } else {
      refresh();
    }
    setTimeout(this.setNowPlaying.bind(null, SOCKET), CURRENT_PULL);
  };
}

//! fix any type for next 3
const getImgUrl = (images: any) => {
  let filtered = images.filter((image: any) => {
    return image.width >= 240 && image.width <= 350;
  });
  return filtered[0].url;
};

const getArtists = (artists: any) => {
  return artists
    .map((artist: any) => {
      return artist.name;
    })
    .join(', ');
};

const sendablePayload = (songInfo: any) => {
  const payload = {
    imgURL: getImgUrl(songInfo.item.album.images),
    songTitle: songInfo.item.name,
    artist: getArtists(songInfo.item.artists),
    album: songInfo.item.album.name,
  };
  return payload;
};

const refresh = async () => {
  try {
    const newToken = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(newToken.body['access_token']);
    tokenExpirationEpoch = dayjs().add(newToken.body.expires_in, 'second');
  } catch (err) {
    //console.log(err.message)
  }
};

export default Spotify;
