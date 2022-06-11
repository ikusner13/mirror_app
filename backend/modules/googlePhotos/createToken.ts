import { google } from 'googleapis';
import opn from 'open';
import readLine from 'readline';
import fs from 'fs';
import config from 'config';

const scopes: string[] | string = config.get(
  'modules.googlePhotos.config.scopes',
);
const tokenPath: string = config.get('modules.googlePhotos.config.tokenPath');

//! fix any types

const createToken = () => {
  fs.readFile(__dirname + '/auth.json', (err, content) => {
    if (err) return console.log('Error loading client file:', err);
    authorize(JSON.parse(content as any));
  });
};
const authorize = (creds: any) => {
  const { client_id, client_secret, redirect_uris } = creds.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  opn(authUrl).catch(() => {
    console.log('failed to open url');
    console.log('url ', authUrl);
  });
  const r1 = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  r1.question('Enter the code from url here ', (code) => {
    r1.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      fs.writeFile(tokenPath, JSON.stringify(token), (err) => {
        if (err) return console.error('err');
        console.log('Token stored to', tokenPath);
      });
    });
  });
};

createToken();

export { createToken };
