import { google } from 'googleapis';
import fs from 'fs/promises';
import { calculateTimeTil } from './helpers';
import { getAlbum } from './getPhoto';
import Module from '../module';
const moment = require('moment');

//! FIX token_path IMPORT
const token_path = '';

let CALL_TIME = 0;

//! fix any types

class GooglePhotos extends Module {
  public googlePhotos = async (SOCKET: any) => {
    const credentials = await this.getAuthDetails();

    const oAuth2Client = await this.setCredentials(credentials);

    const url = await getAlbum(oAuth2Client);
    SOCKET.emit('googlePhotos', url);

    let nextHour = moment().add(1, 'hour').hour();
    CALL_TIME = calculateTimeTil(nextHour);
    setTimeout(this.googlePhotos.bind(null, SOCKET), CALL_TIME);
  };

  private getAuthDetails = async () => {
    const data = await fs.readFile(__dirname + '/auth.json');
    const content = JSON.parse(data as any);
    return content;
  };
  private setCredentials = async (creds: any) => {
    const { client_id, client_secret, redirect_uris } = creds.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    );
    const tokens = await fs.readFile(__dirname + token_path);
    oAuth2Client.setCredentials(JSON.parse(tokens as any));
    return oAuth2Client;
  };
}

export default GooglePhotos;
