import { Socket } from 'socket.io';

type SocketEventType = 'message';

class Module {
  protected _socket: Socket;

  constructor(socketInstance: Socket) {
    this._socket = socketInstance;
  }

  protected sendSocketEvent(type: SocketEventType, payload: any) {
    this._socket.emit(type, payload);
  }
}

export default Module;
