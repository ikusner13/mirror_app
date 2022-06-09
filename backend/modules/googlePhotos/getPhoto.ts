import { OAuth2Client } from 'google-auth-library';
import { randPhoto } from './helpers';

const albumTitle = '';
let lastPhotos: number[] = [];
let albumLength = 0;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const getAlbum = async (auth: OAuth2Client) => {
  try {
    const headers = await auth.getRequestHeaders(
      'https://photoslibrary.googleapis.com/v1/albums',
    );
    const album = await fetch(
      'https://photoslibrary.googleapis.com/v1/albums',
      {
        method: 'get',
        headers: headers,
        /*{
          
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.credentials.access_token,
          'auth': auth,
          
        },*/
      },
    );
    let data = await album.json();
    const albums = data.albums;
    if (Array.isArray(albums)) {
      for (let album of albums) {
        if (album.title === albumTitle) {
          return getPhotosFromAlbum(auth, album.id);
        }
      }
    }
    if (data.nextPageToken) {
      await delay(500);
      getAlbum(auth);
    } else {
      return console.log('no matching albums');
    }
  } catch (error) {
    console.log('error', error);
  }
};

const getPhotosFromAlbum = async (auth: OAuth2Client, albumId: string) => {
  let photoUrls: string[] = [];
  let returnUrl = '';
  const fetchPhotos = async (pageToken = '') => {
    let body = {
      pageSize: '100',
      pageToken,
      albumId,
    };
    //const params = new URLSearchParams(body)

    const url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + auth.credentials.access_token,
      },
      body: JSON.stringify(body),
    });

    const photos = await res.json();

    if (photos.mediaItems) {
      //! fix
      photos.mediaItems.forEach((element: any) => {
        photoUrls.push(element.baseUrl);
      });
    }

    if (photos.nextPageToken) {
      await delay(500);
      fetchPhotos(photos.nextPageToken);
    } else {
      if (lastPhotos.length === 0) {
        for (let i = 0; i < photoUrls.length; i++) {
          lastPhotos.push(i);
        }
        albumLength = photoUrls.length;
      }
      if (albumLength !== photoUrls.length) {
        if (albumLength < photoUrls.length) {
          for (let i = albumLength; i < photoUrls.length; i++) {
            lastPhotos.push(i);
          }
        } else {
          lastPhotos.length = 0;
          for (let i = 0; i < photoUrls.length; i++) {
            lastPhotos.push(i);
          }
        }
        albumLength = photoUrls.length;
      }
      //const url = randPhoto(photoUrls, lastPhotos)
      returnUrl = randPhoto(photoUrls, lastPhotos);
      const PhotoUrlsIndex = photoUrls.indexOf(url);

      const lastPhotosIndex = lastPhotos.indexOf(PhotoUrlsIndex);
      if (lastPhotosIndex > -1) {
        lastPhotos.splice(lastPhotosIndex, 1);
      }
      //console.log('old url', returnUrl)
      return returnUrl;
      //socket.emit('googlePhotos', url)
    }
  };
  return await fetchPhotos();
};

export { getAlbum };