"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Module {
    constructor(socketInstance) {
        this._socket = socketInstance;
    }
    sendSocketEvent(type, payload) {
        console.log('type', type, 'payload', payload);
        this._socket.emit(type, payload);
    }
}
exports.default = Module;
