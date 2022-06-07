import { Socket as SocketClass, Server } from 'socket.io';
import ModulesSocketListener from './modules/modulesSocketListener';

const Socket = {
  startSocket: function (io: Server) {
    //SOCKET SETUP
    io.on('connect', (socket: SocketClass) => {
      const listener = new ModulesSocketListener(socket);

      listener.startListening();
    });
  },
};

export default Socket;
