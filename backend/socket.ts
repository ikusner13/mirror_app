import { Socket as SocketClass, Server } from 'socket.io';
import ModulesSocketListener from './modules/modulesSocketListener';

class Socket {
  startSocket(io: Server) {
    //SOCKET SETUP
    io.on('connect', (socket: SocketClass) => {
      console.log('Socket Connected');
      const listener = new ModulesSocketListener(socket);

      listener.startEvents();
    });
  }
}

export default new Socket();
