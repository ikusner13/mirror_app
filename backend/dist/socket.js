"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const modulesSocketListener_1 = __importDefault(require("./modules/modulesSocketListener"));
const Socket = {
    startSocket: function (io) {
        //SOCKET SETUP
        io.on('connect', (socket) => {
            console.log('Socket Connected');
            const listener = new modulesSocketListener_1.default(socket);
            listener.startListening();
        });
    },
};
exports.default = Socket;
