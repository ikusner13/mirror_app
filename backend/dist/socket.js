"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
const modulesSocketListener_1 = __importDefault(require("./modules/modulesSocketListener"));
class Socket {
    startSocket(io) {
        //SOCKET SETUP
        io.on('connect', (socket) => {
            logger_1.default.info(`socket connected: ${socket.id}`);
            new modulesSocketListener_1.default(socket).startEvents();
        });
    }
}
exports.default = new Socket();
