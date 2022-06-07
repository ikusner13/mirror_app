import { google } from 'googleapis';
import fs from 'fs/promises';
import { calculateTimeTil } from './helpers';
import { getAlbum } from './getPhoto';
import Module from '../module';
import dayjs from 'dayjs';
import config from 'config';

const tokenPath: string = config.get('modules.googlePhotos.config.tokenPath');

//! fix any types

class GooglePhotos extends Module {
  public start(): void {
    this.googlePhotos();
  }

  private googlePhotos = async () => {
    const credentials = await this.getAuthDetails();

    const oAuth2Client = await this.setCredentials(credentials);

    const url = await getAlbum(oAuth2Client);
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
}

export default GooglePhotos;
