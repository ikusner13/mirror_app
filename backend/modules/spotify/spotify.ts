import SpotifyWebApi from 'spotify-web-api-node';
import dayjs from 'dayjs';
import Module from '../module';
import config from 'config';

interface SpotifyConfig {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  access_token: string;
  refresh_token: string;
}

const spotify: SpotifyConfig = config.get('modules.spotify.config');

//SPOTIFY SETUP
const client_id = spotify.client_id; // Your client id
const client_secret = spotify.client_secret; // Your secret
const redirect_uri = spotify.redirect_uri;
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
  public start() {
    this.setNowPlaying();
  }
  private setNowPlaying = async () => {
    if (dayjs().isBefore(tokenExpirationEpoch)) {
      spotifyApi
        .getMyCurrentPlaybackState({})
        .then((result) => {
          CURRENT_PULL = MIN_PULL;
          //if body return something (is playing)
          if (Object.keys(result.body).length > 0) {
            this.sendSocketEvent('spotify', sendablePayload(result.body));
          }
          // isn't playing or has been paused for too long
          else {
            this.sendSocketEvent('spotify', null);
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
    setTimeout(this.setNowPlaying, CURRENT_PULL);
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
