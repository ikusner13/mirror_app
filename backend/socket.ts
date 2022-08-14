import { Socket as SocketClass, Server } from 'socket.io';
import logger from './logger';
import ModulesSocketListener from './modules/modulesSocketListener';

class Socket {
  startSocket(io: Server) {
    //SOCKET SETUP
    io.on('connect', (socket: SocketClass) => {
      logger.info(`socket connected: ${socket.id}`);

      new ModulesSocketListener(socket).startEvents();
    });
  }
}

export default new Socket();
