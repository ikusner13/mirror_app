import { google } from 'googleapis';
import opn from 'open';
import readLine from 'readline';
import fs from 'fs';
import { TOKEN_PATH, scopes } from './config';

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
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error('err');
        console.log('Token stored to', TOKEN_PATH);
      });
    });
  });
};

//createToken()

export { createToken };
