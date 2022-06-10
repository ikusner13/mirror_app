import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Socket from './socket';
import config from 'config';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const port = config.get('port');

app.use(express.static('build'));

Socket.startSocket(io);
server.listen(port, () => {
  console.log(`listening on port ${port}`);
});

export default io;
