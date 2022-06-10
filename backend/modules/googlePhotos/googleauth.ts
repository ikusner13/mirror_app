import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs/promises';
import { calculateTimeTil, randPhoto } from './helpers';
// import { getAlbum } from './getPhoto';
import Module from '../module';
import dayjs from 'dayjs';
import config from 'config';
import fetch from 'node-fetch';

const tokenPath: string = config.get('modules.googlePhotos.config.tokenPath');

const albumTitle = 'Mirror';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

//! fix any types

class GooglePhotos extends Module {
  private _albumLength: number = 0;
  private _lastPhotos: number[] = [];

  public start(): void {
    console.log('starting googlePhotos');
    this.googlePhotos();
  }

  private googlePhotos = async () => {
    const credentials = await this.getAuthDetails();

    const oAuth2Client = await this.setCredentials(credentials);

    const url = await this.getAlbum(oAuth2Client);

    this.sendSocketEvent('googlePhotos', url);

    const nextHour = dayjs().add(1, 'hour').hour();
    const nextCallTime = calculateTimeTil(nextHour);

    setTimeout(this.googlePhotos, nextCallTime);
  };

  private getAuthDetails = async () => {
    const data = await fs.readFile(__dirname + '/auth.json');
    const content = JSON.parse(data.toString());
    return content;
  };

  private setCredentials = async (creds: any) => {
    const { client_id, client_secret, redirect_uris } = creds.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    );
    const tokens = await fs.readFile(__dirname + tokenPath);
    oAuth2Client.setCredentials(JSON.parse(tokens.toString()));

    return oAuth2Client;
  };

  private async getAlbum(auth: OAuth2Client) {
    try {
      const headers = await auth.getRequestHeaders(
        'https://photoslibrary.googleapis.com/v1/albums',
      );
      const album = await fetch(
        'https://photoslibrary.googleapis.com/v1/albums',
        {
          method: 'get',
          headers: headers,
        },
      );
      const data = await album.json();
      const albums = data.albums;
      if (Array.isArray(albums)) {
        for (let album of albums) {
          if (album.title === albumTitle) {
            return this.getPhotosFromAlbum(auth, album.id);
          }
        }
      }
      if (data.nextPageToken) {
        await delay(500);
        this.getAlbum(auth);
      } else {
        return console.log('no matching albums');
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  private async getPhotosFromAlbum(auth: OAuth2Client, albumId: string) {
    let photoUrls: string[] = [];
    let returnUrl = '';
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

      const photos = await res.json();

      if (photos.mediaItems) {
        //! fix
        photos.mediaItems.forEach((element: any) => {
          photoUrls.push(element.baseUrl);
        });
      }

      console.log('photoUrls', photoUrls);

      if (photos.nextPageToken) {
        await delay(500);
        fetchPhotos(photos.nextPageToken);
      } else {
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

        returnUrl = randPhoto(photoUrls, this._lastPhotos);

        const PhotoUrlsIndex = photoUrls.indexOf(returnUrl);

        const lastPhotosIndex = this._lastPhotos.indexOf(PhotoUrlsIndex);
        if (lastPhotosIndex > -1) {
          this._lastPhotos.splice(lastPhotosIndex, 1);
        }

        return returnUrl;
      }
    };
    return await fetchPhotos();
  }
}

export default GooglePhotos;
