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
  },
});

const port = config.get('port');

app.use(function (req, res, next) {
  const origin = req.get('origin');
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true'); //!look into
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma',
  );

  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    //console.log('origin', origin);
    next();
  }
});

//app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('build'));

Socket.startSocket(io);
server.listen(port, () => {
  console.log(`listening on port ${port}`);
});

export default io;
