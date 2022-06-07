import { calculateTimeTil } from './helpers';

const TOKEN_PATH = __dirname + '/token.json';
const CALL_TIME = calculateTimeTil(0);
const scopes = [
  'https://www.googleapis.com/auth/photoslibrary',
  'https://www.googleapis.com/auth/photoslibrary.sharing',
];
const albumTitle = 'Mirror';

export { TOKEN_PATH, CALL_TIME, scopes, albumTitle };
