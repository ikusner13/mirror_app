import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Socket from './socket';
import config from 'config';

const port = config.get('port');
const origin = config.get('origin');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `http://localhost:${origin}`,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(express.static('build'));

Socket.startSocket(io);

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});

export default io;
