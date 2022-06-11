import io from 'socket.io-client';

const port = process.env.NODE_ENV === 'production' ? 5002 : 5001;

const SERVER = `http://localhost:${port}/`;

const socket = io(SERVER);

export default socket;
