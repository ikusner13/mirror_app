import { Socket } from 'socket.io';

type SocketEventType =
  | 'message'
  | 'weather'
  | 'spotify'
  | 'googlePhotos'
  | 'calendar';

abstract class Module {
  protected _socket: Socket;

  constructor(socketInstance: Socket) {
    this._socket = socketInstance;
  }

  /**
   * implement module functionality on socket connect
   */
  abstract start(): void;

  protected sendSocketEvent(type: SocketEventType, payload: any) {
    console.log('type', type, 'payload', payload);
    this._socket.emit(type, payload);
  }
}

export default Module;
