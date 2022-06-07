import io from 'socket.io-client';

const port = 5001;

const SERVER = `http://localhost:${port}/`;

const socket = io(SERVER);

export default socket;
