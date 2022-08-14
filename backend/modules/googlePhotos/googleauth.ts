import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { calculateTimeTil, randPhoto } from './helpers';
import Module from '../module';
import dayjs from 'dayjs';
import config from 'config';
import fetch from 'node-fetch';
import logger from '../../logger';

interface Album {
  id: string;
  title: string;
  productUrl: string;
  isWriteable: boolean;
  shareInfo: {};
  mediaItemsCount: string;
  coverPhotoBaseUrl: string;
  coverPhotoMediaItemId: string;
}

interface Photo {
  mediaItems: {
    id: string;
    description: string;
    productUrl: string;
    baseUrl: string;
    mimeType: string;
    mediaMetadata: {};
    contributorInfo: {};
    filename: string;
  }[];
  nextPageToken: string;
}

interface Auth {
  installed: {
    client_id: string;
    project_id: string;
    auth_url: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

interface Token {
  access_token: string;
  scope: string;
  token_type: string;
}

const albumTitle: string = config.get('modules.googlePhotos.config.albumTitle');
const token: Token = config.get('modules.googlePhotos.token');
const auth: Auth = config.get('modules.googlePhotos.auth');

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

class GooglePhotos extends Module {
  private _albumLength: number = 0;
  private _lastPhotos: number[] = [];

  public start(): void {
    this.googlePhotos();
  }

  private googlePhotos = async () => {
    const oAuth2Client = await this.getAuthDetails();

    const url = await this.getPhotoUrl(oAuth2Client);

    this.sendSocketEvent('googlePhotos', url);

    const nextHour = dayjs().add(1, 'hour').hour();
    const nextCallTime = calculateTimeTil(nextHour);

    setTimeout(this.googlePhotos, nextCallTime);
  };

  private getAuthDetails = async () => {
    const { client_id, client_secret, redirect_uris } = auth.installed;

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    );

    oAuth2Client.setCredentials({ ...token });

    return oAuth2Client;
  };

  private async getPhotoUrl(auth: OAuth2Client) {
    const albumId = await this.getAlbum(auth);

    if (albumId) {
      return await this.getPhotoFromAlbum(auth, albumId);
    }

    return '';
  }

  private async getAlbum(auth: OAuth2Client) {
    try {
      const headers = await auth.getRequestHeaders(
        'https://photoslibrary.googleapis.com/v1/albums',
      );
      const albumData = await fetch(
        'https://photoslibrary.googleapis.com/v1/albums',
        {
          method: 'get',
          headers: headers,
        },
      );

      const data = await albumData.json();
      const albums: Album[] = data.albums;

      const album = albums.find((album) => album.title === albumTitle);

      // if found album
      if (album) {
        return album.id;
      }

      // if album is not found, and there is next page to look at
      // idk if this is doing anything since query param isnt being sent
      if (data.nextPageToken) {
        await delay(500);
        this.getAlbum(auth);
      } else {
        throw new Error('could not find album');
      }
    } catch (error: any) {
      logger.error(`failed to fetch album ${error.message}`);
    }
  }

  private getRandomPhoto(photoUrls: string[]) {
    if (this._lastPhotos.length === 0) {
      for (let i = 0; i < photoUrls.length; i++) {
        this._lastPhotos.push(i);
      }
      this._albumLength = photoUrls.length;
    }

    if (this._albumLength !== photoUrls.length) {
      if (this._albumLength < photoUrls.length) {
        for (let i = this._albumLength; i < photoUrls.length; i++) {
          this._lastPhotos.push(i);
        }
      } else {
        this._lastPhotos.length = 0;
        for (let i = 0; i < photoUrls.length; i++) {
          this._lastPhotos.push(i);
        }
      }
      this._albumLength = photoUrls.length;
    }

    const returnPhoto = randPhoto(photoUrls, this._lastPhotos);

    const PhotoUrlsIndex = photoUrls.indexOf(returnPhoto);
    const lastPhotosIndex = this._lastPhotos.indexOf(PhotoUrlsIndex);
    if (lastPhotosIndex > -1) {
      this._lastPhotos.splice(lastPhotosIndex, 1);
    }

    return returnPhoto;
  }

  private async getPhotoFromAlbum(auth: OAuth2Client, albumId: string) {
    let photoUrls: string[] = [];
    const fetchPhotos = async (pageToken = '') => {
      let body = {
        pageSize: '100',
        pageToken,
        albumId,
      };
      const url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search';
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.credentials.access_token,
        },
        body: JSON.stringify(body),
      });

      const photos: Photo = await res.json();

      if (photos.mediaItems) {
        photos.mediaItems.forEach((element) => {
          photoUrls.push(element.baseUrl);
        });
      }

      if (photos.nextPageToken) {
        await delay(500);
        fetchPhotos(photos.nextPageToken);
      } else {
        return this.getRandomPhoto(photoUrls);
      }
    };
    return (await fetchPhotos()) as string;
  }
}

export default GooglePhotos;
